/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/dot-notation */

import { redisInsance } from '@core/databases/Redis'
import queryGen from '@core/libs/queryGennerator'
import { getClientById, getClientByOptions } from '@modules/client/client.service'
import { Freelancer } from '@modules/freelancer'
import { IFreelancerDoc } from '@modules/freelancer/freelancer.interfaces'
import {
  getFreelancerById,
  getLastestTopCurrentTypeTracking,
  getLastestTopJobs,
  getSimilarByFreelancerId,
  getTopCurrentTypeTracking,
  updateSimilarById,
} from '@modules/freelancer/freelancer.service'
import { bulkCreateNotify, createNotify } from '@modules/notify/notify.service'
import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { updateProposalStatusBulk } from '@modules/proposal/proposal.service'
import { Skill } from '@modules/skill'
import { User } from '@modules/user'
import { EJobStatus, EStatus } from 'common/enums'
import { FEMessage, FERoutes } from 'common/enums/constant'
import { logger } from 'common/logger'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { createArrayAroundNumber, createFuzzyRegex, extractKeywords } from 'utils/helperFunc'
import App from '@modules/admin/models/app.model'
import { updateJobsPointsById } from '@modules/user/user.service'
import { getAppInfo } from '@modules/admin/controllers/dashboard.controller'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IJobDoc, NewCreatedJob, UpdateJobBody } from './job.interfaces'
import Job, { JobCategory, JobTag } from './job.model'

export const excludingFilter = (freelancer?: IFreelancerDoc) => {
  const filterByFreelancer = []
  if (freelancer) {
    filterByFreelancer.push({ appliedFreelancers: { $nin: [freelancer?._id?.toString()] } })
    filterByFreelancer.push({ blockFreelancers: { $nin: [freelancer?._id?.toString()] } })
    if (freelancer?.jobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.jobs || [] } })
    }
    if (freelancer?.favoriteJobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.favoriteJobs || [] } })
    }
  }
  return filterByFreelancer
}

/**
 * Create a job
 * @param {NewCreatedJob} jobBody
 * @returns {Promise<IJobDoc>}
 */
export const createJob = async (jobBody: NewCreatedJob): Promise<IJobDoc> => {
  try {
    const client = await getClientById(jobBody.client)
    if (!client) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found client')
    }
    // if (!client?.paymentVerified) {
    jobBody['status'] = [
      {
        status: EJobStatus.PENDING,
        comment: 'Client submit but job is not verified',
        date: new Date(),
      },
    ]
    jobBody['currentStatus'] = EJobStatus.PENDING
    // }
    const createdJob = await Job.create(jobBody)

    const appInfo = await getAppInfo()

    logger.info(`App info: ${appInfo}`)

    await updateJobsPointsById(new mongoose.Types.ObjectId(client?.user), appInfo?.clientSicks?.postJob, true)

    // await User.updateOne(
    //   { _id: new mongoose.Types.ObjectId(client?.user) },
    //   { $inc: { jobsPoints: -appInfo?.clientSicks.postJob } }
    // )
    // if (client?.paymentVerified) {
    //   const followedFreelancer = await Freelancer.find({ favoriteClients: { $in: [client?._id] } }).populate('user')
    //   const notifyBodies = followedFreelancer?.map(f => ({
    //     to: f.user._id,
    //     path: FERoutes.jobDetail + (createdJob._id || ''),
    //     attachedId: createdJob._id,
    //     content: FEMessage(createdJob.title).newJobCreated,
    //   }))
    //   bulkCreateNotify(notifyBodies)
    // }
    client.jobs = client.jobs.concat(createdJob._id)
    client.save()
    return createdJob
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `cannot create job ${error}`)
  }
}

/**
 * Query for jobs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryJobs = async (
  filter: Record<string, any>,
  options: IOptions,
  freelancer?: IFreelancerDoc | null
): Promise<QueryResult> => {
  const titleFilter = filter['searchText'] ? { title: { $regex: `${filter.searchText || ''}`, $options: 'i' } } : {}

  const categoryFilter = filter['categories']?.length ? { categories: { $in: filter['categories'] || [] } } : {}

  const skillFilter = filter['skills']?.length ? { 'reqSkills.skill': { $in: filter['skills'] || [] } } : {}

  const clientFilter = filter['client'] ? { client: filter['client'] || '' } : {}

  let filterByFreelancer = excludingFilter(freelancer)

  filterByFreelancer = filterByFreelancer?.length ? filterByFreelancer : []

  const queryFilter = {
    $and: [
      titleFilter,
      clientFilter,
      categoryFilter,
      skillFilter,
      ...filterByFreelancer,
      { isDeleted: { $ne: true } },
      {
        currentStatus: {
          $in: filter['currentStatus']?.length ? filter['currentStatus'] : [EJobStatus.OPEN, EJobStatus.PENDING],
        },
      },
    ],
  }

  if (!options.projectBy) {
    options.sortBy = 'updatedAt:desc'
    options.populate = 'client,categories,reqSkills.skill'
    options.projectBy =
      'client, categories, title, description, type, locations, complexity, payment, budget, createdAt, proposals, nOEmployee, preferences'
  }
  const jobs = await Job.paginate(queryFilter, options)
  return jobs
}

/**
 * Advanced Query for jobs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryAdvancedJobs = async (
  filter?: Record<string, any>,
  options?: IOptions,
  searchText?: string,
  freelancer?: IFreelancerDoc | null
): Promise<QueryResult> => {
  filter['title'] && (filter['title'] = { $search: `${filter['title']}`, $diacriticSensitive: true })
  filter['description'] && (filter['description'] = { $regex: `${filter['description']}`, $options: 'i' })

  filter['locations'] && (filter['locations'] = { 'preferences.locations': { $in: filter['locations'] } })
  filter['jobDuration'] && (filter['jobDuration'] = { jobDuration: filter['jobDuration'] })
  filter['type'] && (filter['type'] = { type: filter['type'] })
  filter['complexity'] && (filter['complexity'] = { 'scope.complexity': { $in: filter['complexity'] } })
  filter['paymentType'] && (filter['paymentType'] = { 'payment.type': { $in: filter['paymentType'] } })
  filter['skills'] && (filter['skills'] = { 'reqSkills.skill': { $in: filter['skills'] } })
  filter['categories'] && (filter['categories'] = { categories: { $in: filter['categories'] } })
  filter['tags'] && (filter['tags'] = { tags: { $in: filter['tags'] } })
  filter['currentStatus'] && (filter['currentStatus'] = { currentStatus: { $in: filter['currentStatus'] } })

  filter['duration'] &&
    (filter['duration'] = {
      'scope.duration': queryGen.numRanges(filter['duration']?.from, filter['duration']?.to),
    })
  filter['budget'] &&
    (filter['budget'] = {
      budget: queryGen.numRanges((filter['budget']?.from || 0) / 1000, (filter['budget']?.to || 0) / 1000),
    })
  filter['paymentAmount'] &&
    (filter['paymentAmount'] = {
      'payment.amount': queryGen.numRanges(
        (filter['paymentAmount']?.from || 0) / 1000,
        (filter['paymentAmount']?.to || 0) / 1000
      ),
    })
  filter['proposals'] &&
    (filter['proposals'] = { proposals: queryGen.numRanges(filter['nOProposals']?.from, filter['nOProposals']?.to) })
  filter['nOEmployee'] &&
    (filter['nOEmployee'] = {
      'preferences.nOEmployee': queryGen.numRanges(filter['nOEmployee'] === 1 ? 0 : 2, filter['nOEmployee']),
    })

  let filterByFreelancer = excludingFilter(freelancer)

  filterByFreelancer = filterByFreelancer?.length ? filterByFreelancer : []

  const filterExtract = Object.keys(filter).map(f => filter[f])
  const queryFilter = {
    $and: [
      {
        $or: [
          // { $text: { $search: `${searchText}`, $caseSensitive: false, $diacriticSensitive: true } },
          { title: { $regex: `${searchText || ''}`, $options: 'si' } },
          { description: { $regex: `${searchText}`, $options: 'i' } },
        ],
      },
      ...filterByFreelancer,
      ...filterExtract,
      { isDeleted: { $ne: true } },
    ],
  }

  options.populate = 'client,categories,reqSkills.skill'
  options.sortBy = 'updatedAt:desc'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, type, locations, scope, payment, budget, createdAt, nOProposals, nOEmployee, preferences, type'
  }

  const jobs = await Job.paginate(queryFilter, options)
  return jobs
}

/**
 * search jobs by text
 * @param {string} searchText - text
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const searchJobsByText = async (
  searchText: string,
  options: IOptions,
  freelancer?: IFreelancerDoc | null
): Promise<QueryResult> => {
  const foundCats = await JobCategory.find({ name: { $regex: searchText, $options: 'i' } })
  const foundSkills = await Skill.find({ name: { $regex: searchText, $options: 'i' } })
  const foundTags = await JobTag.find({ name: { $regex: searchText, $options: 'i' } })

  let filterByFreelancer = excludingFilter(freelancer)

  filterByFreelancer = filterByFreelancer?.length ? filterByFreelancer : []

  const filter = {
    $and: [
      {
        $or: [
          { title: { $search: searchText, $diacriticSensitive: true } },
          { description: { $regex: searchText, $options: 'i' } },
          { categories: { $in: foundCats || [] } },
          { 'reqSkills.skill': { $in: foundSkills || [] } },
          { tags: { $in: foundTags || [] } },
        ],
      },
      ...filterByFreelancer,
      { isDeleted: { $ne: true } },
      { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } },
    ],
  }
  options.sortBy = 'updatedAt:desc'

  options.populate = 'client,categories,reqSkills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, type, locations, complexity, payment, budget, createdAt, nOProposals, nOEmployee, preferences, type'
  }

  const jobs = await Job.paginate(filter, options)
  return jobs
}

/**
 * manually get recommended jobs based on freelancer(low level vcl)
 * @param {string} freelancerId
 * @param {any} filter,
 * @param {Object} options
 * @param {IFreelancerDoc} freelancer
 * @returns {Promise<QueryResult>}
 */
export const getRcmdJob = async (
  freelancerId: mongoose.Types.ObjectId,
  categories: any,
  skills: any,
  options: IOptions,
  freelancer?: IFreelancerDoc | null
): Promise<QueryResult> => {
  const cacheKey = `getRcmdJob:${freelancerId}`

  // Check if data is in cache
  const cachedData = await redisInsance.getValue(cacheKey)
  if (cachedData) {
    logger.info(`getRcmdJob from cache for freelancerId: ${cacheKey}`)
    return JSON.parse(cachedData)
  }

  let similarDocs = await getSimilarByFreelancerId(freelancerId)
  if (!similarDocs) {
    similarDocs = await updateSimilarById(freelancerId)
  }

  if (!options?.projectBy) {
    options.projectBy = `client, categories, title, description, type, locations, complexity, payment, budget, createdAt, nOProposals, 
      nOEmployee, preferences, totalScore, scope, jobDuration
      score_title, score_description, score_my_skills, score_similar_skills, score_my_categories, score_locations, score_categories, score_expertise, score_paymentAmount, score_paymentType`
  }

  if (!options?.populate) {
    options.populate = 'client,categories,reqSkills.skill'
  }

  const projectFields = options.projectBy.split(',').reduce((acc, field) => {
    acc[field.trim()] = 1
    return acc
  }, {})

  const populateFields = options?.populate?.split(',').map(field => {
    if (field.trim() === 'client') {
      return {
        path: field.trim(),
        match: { isDeleted: { $ne: true } },
        select: 'rating spent paymentVerified name user preferLocations',
      }
    }
    return { path: field.trim() }
  })

  const preferSkills = freelancer?.skills?.map(s => ({ ...s, skill: s?.skill?.toString() }))

  logger.info(`preferSkils: ${typeof preferSkills[0].skill}`)

  const filterPipeline: any = [
    {
      $match: {
        $or: [
          { title: { $regex: `${similarDocs?.similarKeys}`, $options: 'si' } },
          { description: { $regex: `${similarDocs?.similarKeys}`, $options: 'si' } },
          { categories: { $in: similarDocs?.similarJobCats?.map(c => c.toString()) || [] } },
          { 'reqSkills.skill': { $in: similarDocs?.similarSkills || [] } },
          { tags: { $in: similarDocs?.similarTags || [] } },
          { 'preferences.locations': { $in: similarDocs?.similarLocations || [] } },
        ],
      },
    },
    {
      $match: {
        $and: [
          { appliedFreelancers: { $nin: [freelancer?._id?.toString()] } },
          { blockFreelancers: { $nin: [freelancer?._id?.toString()] } },
          freelancer?.jobs ? { _id: { $nin: freelancer?.jobs || [] } } : {},
          freelancer?.favoriteJobs ? { _id: { $nin: freelancer?.favoriteJobs || [] } } : {},
        ],
      },
    },
    {
      $match: {
        $and: [
          { isDeleted: { $ne: true } },
          { currentStatus: { $in: [EJobStatus.OPEN] } },
          categories?.length ? { categories: { $in: categories || [] } } : {},
          skills?.length ? { 'reqSkills.skill': { $in: skills || [] } } : {},
        ],
      },
    },

    {
      $addFields: {
        score_title: { $cond: [{ $eq: ['$title', similarDocs?.similarKeys || ''] }, 1, 0] },
        score_description: { $cond: [{ $eq: ['$description', similarDocs?.similarKeys || ''] }, 1, 0] },
        // score_title: {
        //   $cond: [{ $regexMatch: { input: '$title', regex: similarDocs?.similarKeys } }, 1, 0],
        // },
        // score_description: {
        //   $cond: [{ $regexMatch: { input: '$description', regex: similarDocs?.similarKeys } }, 1, 0],
        // },
        score_categories: {
          $multiply: [
            { $size: { $setIntersection: [similarDocs?.similarJobCats || [], { $ifNull: ['$categories', []] }] } },
            0.8,
          ],
        },
        score_my_categories: {
          $multiply: [
            {
              $size: {
                $setIntersection: [
                  freelancer?.preferJobType?.map(c => c?._id?.toString() || c?.id?.toString()) || [],
                  { $ifNull: ['$categories', []] },
                ],
              },
            },
            1.9,
          ],
        },
        score_potential_categories: {
          $multiply: [
            {
              $size: {
                $setIntersection: [similarDocs?.potentialJobCats || [], { $ifNull: ['$categories', []] }],
              },
            },
            1.4,
          ],
        },
        score_similar_skills: {
          $multiply: [
            { $size: { $setIntersection: [similarDocs?.similarSkills || [], { $ifNull: ['$reqSkills.skill', []] }] } },
            1.1,
          ],
        },
        score_my_skills: {
          $multiply: [
            {
              $size: {
                $setIntersection: [
                  freelancer?.skills?.map(s => s?.skill?._id?.toString() || s?.skill?.id?.toString()) || [],
                  { $ifNull: ['$reqSkills.skill', []] },
                ],
              },
            },
            2.3,
          ],
        },
        score_potential_skills: {
          $multiply: [
            {
              $size: {
                $setIntersection: [similarDocs?.potentialSkills || [], { $ifNull: ['$reqSkills.skill', []] }],
              },
            },
            1.5,
          ],
        },
        score_tags: { $size: { $ifNull: ['$tags', []] } },
        score_locations: {
          $multiply: [
            {
              $size: {
                $setIntersection: [similarDocs?.similarLocations || [], { $ifNull: ['$preferences.locations', []] }],
              },
            },
            1.2,
          ],
        },
        score_my_locations: {
          $multiply: [
            {
              $size: {
                $setIntersection: [freelancer?.currentLocations || [], { $ifNull: ['$preferences.locations', []] }],
              },
            },
            1.8,
          ],
        },
        score_paymentType: { $cond: [{ $eq: ['$payment.type', freelancer?.expectedPaymentType || ''] }, 1, 0] },
        score_paymentAmount: {
          $cond: [
            {
              $and: [
                {
                  $gte: [
                    '$payment.amount',
                    freelancer?.expectedAmount ? freelancer.expectedAmount - freelancer.expectedAmount / 4.3 : 0,
                  ],
                },
                {
                  $lte: [
                    '$payment.amount',
                    freelancer?.expectedAmount ? freelancer.expectedAmount + freelancer.expectedAmount / 4.3 : 0,
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
        score_expertise: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$complexity', freelancer?.expertiseLevel ? freelancer.expertiseLevel - 1 : 0],
                },
                {
                  $lte: ['$complexity', freelancer?.expertiseLevel ? freelancer.expertiseLevel + 1 : 0],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        totalScore: {
          $add: [
            '$score_title',
            '$score_description',
            '$score_categories',
            '$score_similar_skills',
            '$score_locations',
            '$score_paymentType',
            '$score_paymentAmount',
            '$score_my_skills',
            '$score_potential_skills',
            '$score_potential_categories',
            '$score_my_locations',
            '$score_paymentType',
            '$score_paymentAmount',
            '$score_expertise',
            '$score_tags',
            '$score_my_categories',
          ],
        },
      },
    },
    { $project: projectFields },

    { $sort: { totalScore: -1 as any } },
  ]

  const sortOptions = {}
  const [sortField, sortOrder] = options?.sortBy ? options.sortBy.split(':') : 'totalScore:desc'.split(':')
  sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1

  filterPipeline.push({ $sort: sortOptions })

  const skip = ((options?.page || 1) - 1) * (options?.limit || 10)
  filterPipeline.push({ $skip: skip })
  filterPipeline.push({ $limit: options?.limit || 10 })

  const jobs = await Job.aggregate(filterPipeline)

  const fullfillJobs = await Job.populate(jobs, populateFields)

  const totalResults = await Job.countDocuments({ isDeleted: { $ne: true } })

  const queryReSults: QueryResult = {
    results: fullfillJobs,
    totalResults,
    totalPages: Math.ceil(totalResults / (options?.limit || 10)),
    limit: options?.limit || 10,
    page: options?.page || 1,
  }

  await redisInsance.setWithExpiration(cacheKey, JSON.stringify(queryReSults), 60 * 60 * 16) // 16 hours expiration

  return queryReSults
}

/**
 * @returns {Promise<IJobDoc | null>}
 */
export const getAllJob = async (): Promise<IJobDoc[] | null> => {
  const jobs = await Job.find()
    .select(
      'client categories title description locations complexity payment budget createdAt nOProposals nOEmployee preferences reqSkills type jobDuration'
    )
    .populate([{ path: 'client', select: 'rating spent paymentVerified' }, { path: 'categories' }])
    .sort({ updatedAt: 1 })
    .lean()

  return jobs
}

/**
 * @returns {Promise<QueryResult | null>}
 */
export const getFavJobByFreelancer = async (
  freelancerId: mongoose.Types.ObjectId,
  options: IOptions
): Promise<QueryResult | null> => {
  const freelancer = await getFreelancerById(freelancerId)

  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found freelancer')
  }

  const filter = { _id: { $in: freelancer?.favoriteJobs || [] } }

  options.sortBy = 'updatedAt:desc'
  options.populate = 'client,categories,reqSkills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, type, locations, complexity, payment, budget, createdAt, nOProposals, nOEmployee, preferences, type'
  }

  const jobs = await Job.paginate(filter, options)
  return jobs
}

export const getSimilarByJobFields = async (
  categories?: any[],
  reqSkills?: any[],
  locations?: any[],
  complexities?: any[],
  durations?: any[],
  excludeJobIds?: any[],
  regexPattern?: any,
  freelancerId?: any,
  budget?: any,
  nOEmployees?: any,
  payments?: any,
  limit?: any
) => {
  try {
    const options = `client, categories, title, description, type, locations, complexity, payment, budget, createdAt, nOProposals, 
        nOEmployee, preferences, totalScore, scope, jobDuration, similarityScore`

    const projectFields = options?.split(',').reduce((acc, field) => {
      acc[field.trim()] = 1
      return acc
    }, {})

    const relatedJobs = await Job.aggregate([
      {
        $match: {
          _id: { $nin: excludeJobIds?.map(job => new mongoose.Types.ObjectId(job)) },
          currentStatus: EJobStatus.OPEN,
        },
      },
      {
        $match: {
          $and: [
            { appliedFreelancers: { $nin: [freelancerId?.toString()] } },
            { blockFreelancers: { $nin: [freelancerId?.toString()] } },
          ],
        },
      },
      {
        $match: {
          $and: [{ isDeleted: { $ne: true } }, { currentStatus: { $in: [EJobStatus.OPEN] } }],
        },
      },
      {
        $addFields: {
          similarityScore: {
            $sum: [
              {
                $cond: [{ $regexMatch: { input: '$title', regex: regexPattern } }, 1, 0],
              },
              {
                $cond: [{ $regexMatch: { input: '$description', regex: regexPattern } }, 1, 0],
              },
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [categories || [], { $ifNull: ['$categories', []] }],
                    },
                  },
                  2.7,
                ],
              },
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [reqSkills || [], { $ifNull: ['$reqSkills.skill', []] }],
                    },
                  },
                  2.9,
                ],
              },
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [locations || [], { $ifNull: ['$preferences.locations', []] }],
                    },
                  },
                  1.4,
                ],
              },
              { $cond: [{ $in: ['$scope.complexity', complexities] }, 1, 0] },
              { $cond: [{ $in: ['$scope.duration', durations] }, 1, 0] },
              { $cond: [{ $in: ['$preferences.nOEmployee', nOEmployees] }, 1, 0] },
              {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$budget', (budget || 0) - (budget || 0) / 4.3] },
                      { $lte: ['$budget', (budget || 0) + (budget || 0) / 4.3] },
                    ],
                  },
                  1,
                  0,
                ],
              },
              {
                $sum: {
                  $map: {
                    input: payments,
                    as: 'payment',
                    in: {
                      $cond: [
                        {
                          $and: [
                            { $eq: ['$payment.type', '$$payment.type'] },
                            {
                              $and: [
                                {
                                  $gte: [
                                    '$payment.amount',
                                    { $subtract: ['$$payment.amount', { $divide: ['$$payment.amount', 4.3] }] },
                                  ],
                                },
                                {
                                  $lte: [
                                    '$payment.amount',
                                    { $add: ['$$payment.amount', { $divide: ['$$payment.amount', 4.3] }] },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
      { $project: projectFields },
      {
        $sort: { similarityScore: -1 as any },
      },
      {
        $limit: limit || 20,
      },
    ])

    const populate = 'client,categories,reqSkills.skill'
    const populateFields = populate?.split(',').map(field => {
      if (field.trim() === 'client') {
        return {
          path: field.trim(),
          match: { isDeleted: { $ne: true } },
          select: 'rating spent paymentVerified name user preferLocations',
        }
      }
      return { path: field.trim() }
    })

    const fullfillJobs = await Job.populate(relatedJobs, populateFields)

    return fullfillJobs
  } catch (error: any) {
    logger.error(`Error finding related jobs:${error}`)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong')
  }
}

export const getCurrentInterestedJobsByType = async (
  freelancer: IFreelancerDoc,
  options?: IOptions,
  inputType?: any
): Promise<any | null> => {
  try {
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }

    // const cacheKey = `getJobByFav:${freelancer?._id?.toString()}`

    // const cachedData = await redisInsance.getValue(cacheKey)
    // if (cachedData) {
    //   logger.info(`getJobByFav from cache for freelancerId: ${cacheKey}`)
    //   return JSON.parse(cachedData)
    // }

    const type = inputType || (await getLastestTopCurrentTypeTracking(freelancer))

    const matchingJobs = await Job.aggregate([
      {
        $match: {
          currentStatus: 'open',
        },
      },
      {
        $addFields: {
          totalMatchingPoints: {
            $sum: [
              {
                $reduce: {
                  input: '$reqSkills',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      {
                        $let: {
                          vars: {
                            matchedSkill: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: type?.skillRankings,
                                    as: 'sr',
                                    cond: { $eq: ['$$sr.skill', '$$this.skill'] },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                          in: '$$matchedSkill.withTimePoints',
                        },
                      },
                    ],
                  },
                },
              },
              {
                $reduce: {
                  input: '$categories',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      {
                        $let: {
                          vars: {
                            matchedCategory: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: type?.categoryRankings,
                                    as: 'cr',
                                    cond: { $eq: ['$$cr.category', '$$this'] },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                          in: '$$matchedCategory.withTimePoints',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      {
        $sort: { totalMatchingPoints: -1 },
      },
      {
        $limit: options?.limit || 15,
      },
    ])

    return matchingJobs
  } catch (error: any) {
    logger.error(`Error finding related jobs:${error}`)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error finding related jobs: ${error}`)
  }
}

export const getTopInterestedJobsByType = async (
  freelancer: IFreelancerDoc,
  options?: IOptions
): Promise<any | null> => {
  try {
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }

    // const cacheKey = `getJobByFav:${freelancer?._id?.toString()}`

    // const cachedData = await redisInsance.getValue(cacheKey)
    // if (cachedData) {
    //   logger.info(`getJobByFav from cache for freelancerId: ${cacheKey}`)
    //   return JSON.parse(cachedData)
    // }

    const type = await getTopCurrentTypeTracking(freelancer)

    const matchingJobs = await Job.aggregate([
      {
        $match: {
          currentStatus: 'open',
        },
      },
      {
        $addFields: {
          totalMatchingPoints: {
            $sum: [
              {
                $reduce: {
                  input: '$reqSkills',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      {
                        $let: {
                          vars: {
                            matchedSkill: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: type?.skillRankings,
                                    as: 'sr',
                                    cond: { $eq: ['$$sr.skill', '$$this.skill'] },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                          in: '$$matchedSkill.totalPoints',
                        },
                      },
                    ],
                  },
                },
              },
              {
                $reduce: {
                  input: '$categories',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      {
                        $let: {
                          vars: {
                            matchedCategory: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: type?.categoryRankings,
                                    as: 'cr',
                                    cond: { $eq: ['$$cr.category', '$$this'] },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                          in: '$$matchedCategory.totalPoints',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      {
        $sort: { totalMatchingPoints: -1 },
      },
      {
        $limit: 20,
      },
    ])

    return matchingJobs
  } catch (error: any) {
    logger.error(`Error finding related jobs:${error}`)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error finding related jobs: ${error}`)
  }
}

/**
 * @returns {Promise<QueryResult | null>}
 */
export const getCurrentInterestedJobs = async (freelancer: IFreelancerDoc, options: IOptions): Promise<any | null> => {
  try {
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }

    // const cacheKey = `getJobByFav:${freelancer?._id?.toString()}`

    // const cachedData = await redisInsance.getValue(cacheKey)
    // if (cachedData) {
    //   logger.info(`getJobByFav from cache for freelancerId: ${cacheKey}`)
    //   return JSON.parse(cachedData)
    // }

    const jobs = await getLastestTopJobs(freelancer)

    const categories = []
    const reqSkills = []
    const complexities = new Set()
    const durations = new Set()
    const locations = []
    const nOEmployees = []
    const payments = []
    const text = ''
    let avgBudget = 0

    jobs?.forEach((j: any) => {
      const job = j?.job
      job?.categories?.length && categories.push(...job.categories)
      job?.reqSkills?.length && reqSkills.push(...job.reqSkills.map(skill => skill.skill))
      complexities.add(job?.scope?.complexity)
      durations.add(job?.scope?.duration)
      job?.preferences?.locations && locations.push(...job.preferences.locations)
      text.concat(job?.title, job?.description)
      avgBudget += job?.budget || 0
      job?.payment && payments.push(job?.payment)
      nOEmployees.push(job?.preferences?.nOEmployee)
    })

    const keyWords = extractKeywords(`${text}`)

    logger.info('Extracted Keywords', keyWords)

    const similarRegex = createFuzzyRegex(keyWords)

    const favoriteJobs = freelancer?.favoriteJobs?.map(job => new mongoose.Types.ObjectId(job._id)) || []
    const freelancerJobs = freelancer?.jobs?.map(job => new mongoose.Types.ObjectId(job)) || []

    const uniqueCategories = Array.from(new Set(categories))
    const uniqueReqSkills = Array.from(new Set(reqSkills))
    const uniqueLocations = Array.from(new Set(locations))

    const excludeJobIds = [...new Set([...favoriteJobs, ...freelancerJobs])]

    const relatedJobs = await getSimilarByJobFields(
      uniqueCategories,
      uniqueReqSkills,
      uniqueLocations,
      Array.from(complexities),
      Array.from(durations),
      excludeJobIds,
      similarRegex,
      freelancer?._id?.toString(),
      avgBudget / (freelancer?.favoriteJobs?.length || 1),
      nOEmployees,
      payments
    )
    // await redisInsance.setWithExpiration(cacheKey, JSON.stringify(relatedJobs), 60 * 60 * 16) // 16 hours expiration

    return relatedJobs
  } catch (error: any) {
    logger.error(`Error finding related jobs:${error}`)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error finding related jobs: ${error}`)
  }
}

export const findRelatedJobsWithPoints = async (jobsWithPoints: any[], limit?: number) => {
  try {
    const jobIds = jobsWithPoints.map(job => new mongoose.Types.ObjectId(job.job.id))

    const relatedJobs = await Job.aggregate([
      {
        $match: {
          _id: { $nin: jobIds },
          currentStatus: 'open',
        },
      },
      {
        $addFields: {
          similarityScore: {
            $sum: [
              {
                $cond: [
                  { $in: ['$scope.complexity', jobsWithPoints.map(job => job.job.scope.complexity)] },
                  '$adjustedPoints',
                  0,
                ],
              },
              {
                $cond: [
                  { $in: ['$scope.duration', jobsWithPoints.map(job => job.job.scope.duration)] },
                  '$adjustedPoints',
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $gt: [
                      {
                        $size: {
                          $setIntersection: ['$categories', jobsWithPoints.map(job => job.job.categories)].flat(),
                        },
                      },
                      0,
                    ],
                  },
                  '$adjustedPoints',
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $gt: [
                      {
                        $size: {
                          $setIntersection: [
                            '$reqSkills.skill',
                            jobsWithPoints.map(job => job.job.reqSkills.map(skill => skill.skill)).flat(),
                          ],
                        },
                      },
                      0,
                    ],
                  },
                  '$adjustedPoints',
                  0,
                ],
              },
              {
                $cond: [
                  { $in: ['$preferences.nOEmployee', jobsWithPoints.map(job => job.job.preferences.nOEmployee)] },
                  '$adjustedPoints',
                  0,
                ],
              },
              // {
              //   $cond: [
              //     {
              //       $and: [
              //         {
              //           $gte: [
              //             '$budget',
              //             {
              //               $subtract: [
              //                 jobsWithPoints.map(job => job.job.budget),
              //                 { $divide: [jobsWithPoints.map(job => job.job.budget), 4.3] },
              //               ],
              //             },
              //           ],
              //         },
              //         {
              //           $lte: [
              //             '$budget',
              //             {
              //               $add: [
              //                 jobsWithPoints.map(job => job.job.budget),
              //                 { $divide: [jobsWithPoints.map(job => job.job.budget), 4.3] },
              //               ],
              //             },
              //           ],
              //         },
              //       ],
              //     },
              //     '$adjustedPoints',
              //     0,
              //   ],
              // },
              {
                $sum: {
                  $map: {
                    input: jobsWithPoints.map(job => job.job.reqSkills.map(skill => skill.payment)).flat(),
                    as: 'payment',
                    in: {
                      $cond: [
                        {
                          $and: [
                            { $eq: ['$payment.type', '$$payment.type'] },
                            {
                              $and: [
                                {
                                  $gte: [
                                    '$payment.amount',
                                    { $subtract: ['$$payment.amount', { $divide: ['$$payment.amount', 4.3] }] },
                                  ],
                                },
                                {
                                  $lte: [
                                    '$payment.amount',
                                    { $add: ['$$payment.amount', { $divide: ['$$payment.amount', 4.3] }] },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        '$adjustedPoints',
                        0,
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
      {
        $sort: { similarityScore: -1 },
      },
      {
        $limit: limit || 12,
      },
    ])

    return relatedJobs
  } catch (error: any) {
    logger.error('Error finding related jobs with points:', error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error finding related jobs with points: ${error}`)
  }
}

export const getCurrentInterestedJobsByJobs = async (
  freelancer: IFreelancerDoc,
  options: IOptions
): Promise<any | null> => {
  try {
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }

    // const cacheKey = `getJobByFav:${freelancer?._id?.toString()}`

    // const cachedData = await redisInsance.getValue(cacheKey)
    // if (cachedData) {
    //   logger.info(`getJobByFav from cache for freelancerId: ${cacheKey}`)
    //   return JSON.parse(cachedData)
    // }

    const jobs = await getLastestTopJobs(freelancer)

    const matchJobs = await findRelatedJobsWithPoints(jobs, options?.limit)

    return matchJobs
  } catch (error: any) {
    logger.error('Error finding related jobs with points:', error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error finding related jobs with points: ${error}`)
  }
}

/**
 * @returns {Promise<QueryResult | null>}
 */
export const getJobByFreelancerFav = async (freelancer: IFreelancerDoc, options: IOptions): Promise<any | null> => {
  try {
    if (!freelancer || !freelancer?.favoriteJobs?.length) {
      return { message: 'no Fav Jobs' }
    }

    const cacheKey = `getJobByFav:${freelancer?._id?.toString()}`

    const cachedData = await redisInsance.getValue(cacheKey)
    if (cachedData) {
      logger.info(`getJobByFav from cache for freelancerId: ${cacheKey}`)
      return JSON.parse(cachedData)
    }

    const categories = []
    const reqSkills = []
    const complexities = new Set()
    const durations = new Set()
    const locations = []
    const nOEmployees = []
    const payments = []
    const text = ''
    let avgBudget = 0

    freelancer?.favoriteJobs?.forEach(job => {
      job?.categories?.length && categories.push(...job.categories)
      job?.reqSkills?.length && reqSkills.push(...job.reqSkills.map(skill => skill.skill))
      complexities.add(job?.scope?.complexity)
      durations.add(job?.scope?.duration)
      job?.preferences?.locations && locations.push(...job.preferences.locations)
      text.concat(job?.title, job?.description)
      avgBudget += job?.budget || 0
      job?.payment && payments.push(job?.payment)
      nOEmployees.push(job?.preferences?.nOEmployee)
    })

    const keyWords = extractKeywords(`${text}`)

    logger.info('Extracted Keywords', keyWords)

    const similarRegex = createFuzzyRegex(keyWords)

    const favoriteJobs = freelancer?.favoriteJobs?.map(job => new mongoose.Types.ObjectId(job._id)) || []
    const freelancerJobs = freelancer?.jobs?.map(job => new mongoose.Types.ObjectId(job)) || []

    const uniqueCategories = Array.from(new Set(categories))
    const uniqueReqSkills = Array.from(new Set(reqSkills))
    const uniqueLocations = Array.from(new Set(locations))

    const excludeJobIds = [...new Set([...favoriteJobs, ...freelancerJobs])]

    const relatedJobs = await getSimilarByJobFields(
      uniqueCategories,
      uniqueReqSkills,
      uniqueLocations,
      Array.from(complexities),
      Array.from(durations),
      excludeJobIds,
      similarRegex,
      freelancer?._id?.toString(),
      avgBudget / (freelancer?.favoriteJobs?.length || 1),
      nOEmployees,
      payments
    )
    await redisInsance.setWithExpiration(cacheKey, JSON.stringify(relatedJobs), 60 * 60 * 16) // 16 hours expiration

    return relatedJobs
  } catch (error: any) {
    logger.error(`Error finding related jobs:${error}`)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error finding related jobs: ${error}`)
  }
}

/**
 * Get job by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobById = async (id: mongoose.Types.ObjectId): Promise<IJobDoc | null> =>
  Job.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate(['client', 'categories', 'reqSkills.skill', 'proposals'])
    .lean()

export const getJobByIdNotLean = async (id: mongoose.Types.ObjectId): Promise<IJobDoc | null> =>
  Job.findOne({ _id: id, isDeleted: { $ne: true } })

/**
 * Get job by title
 * @param {string} title
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobBytitle = async (title: string): Promise<IJobDoc | null> =>
  Job.findOne({ title, isDeleted: { $ne: true } })
    .populate(['client', 'categories', 'reqSkills.skill', 'proposals'])
    .lean()

/**
 * Get job by option
 * @param {object} options
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobByOptions = async (Options: any): Promise<IJobDoc | null> =>
  Job.findOne({ ...Options, isDeleted: { $ne: true } })
    .populate(['client', 'categories', 'reqSkills.skill', 'proposals'])
    .lean()

/**
 * Get job by option
 * @param {object} options
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobsByOptions = async (Options: any): Promise<IJobDoc[] | null> =>
  Job.find({ ...Options, isDeleted: { $ne: true } })
    .populate(['client', 'categories', 'reqSkills.skill', 'proposals'])
    .lean()

/**
 * manually get similar jobs based on job input(low level vcl)
 * @param {mongoose.Types.ObjectId} jobId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const getSimilarJobs = async (
  jobId: mongoose.Types.ObjectId,
  options: IOptions,
  freelancer?: IFreelancerDoc | null
): Promise<any> => {
  const job = await Job.findById(jobId).lean()

  const cacheKey = `similarJobs:${jobId?.toString()}`

  const cachedData = await redisInsance.getValue(cacheKey)
  if (cachedData) {
    logger.info(`getSimilarJobs from cache for freelancerId: ${cacheKey}`)
    return JSON.parse(cachedData)
  }

  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found job')
  }

  let filterByFreelancer = excludingFilter(freelancer)

  filterByFreelancer = filterByFreelancer?.length ? filterByFreelancer : []

  let keyWords

  if (job?.title) {
    keyWords = extractKeywords(
      `${`${job?.title} ${job?.description} ${job?.checkLists?.map(c => c).join(' ')} ${job?.questions
        ?.map(c => c)
        .join(' ')}`}`
    )
  }

  const regexPattern = createFuzzyRegex(keyWords)

  const similarRegex = new RegExp(regexPattern, 'gi')

  const fSavedJobs = freelancer?.favoriteJobs || []
  const fJobs = freelancer?.jobs || []

  const relatedJobs = await getSimilarByJobFields(
    job?.categories || [],
    job?.reqSkills?.map(s => s?.skill?.toString()) || [],
    job?.preferences?.locations || [],
    [job?.scope?.complexity],
    createArrayAroundNumber(job?.scope?.duration || 0),
    [...fSavedJobs, ...fJobs],
    similarRegex,
    freelancer?._id?.toString(),
    job?.budget || 0,
    createArrayAroundNumber(job?.preferences?.nOEmployee || 1),
    [job?.payment || { type: 'perHour', amount: 0 }],
    options?.limit
  )

  await redisInsance.setWithExpiration(cacheKey, JSON.stringify(relatedJobs), 60 * 60 * 16) // 16 hours expiration

  return relatedJobs
}

/**
 * Update job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {UpdateJobBody} updateBody
 * @returns {Promise<IJobDoc | null>}
 */
export const updateJobById = async (
  jobId: mongoose.Types.ObjectId,
  updateBody: UpdateJobBody
): Promise<IJobDoc | null> => {
  const job = await getJobByIdNotLean(jobId)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  if (
    job.status.find(({ status }) =>
      [EJobStatus.CANCELLED, EJobStatus.CLOSED, EJobStatus.COMPLETED, EJobStatus.INPROGRESS].includes(status)
    )
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not update job')
  }
  Object.assign(job, updateBody)
  await job.save()
  return job
}

/**
 * Update job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} proposalId
 * @returns {Promise<IJobDoc | null>}
 */
export const addProposaltoJobById = async (
  jobId: mongoose.Types.ObjectId,
  proposalId: string
): Promise<IJobDoc | null> => {
  try {
    const job = await Job.findOneAndUpdate({ _id: jobId }, { $push: { proposals: proposalId } })
    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
    }
    return await job.populate('client')
  } catch (err) {
    throw new Error('cannot add proposals to job')
  }
}

/**
 * Update apply job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} freelancerId
 * @returns {Promise<IJobDoc | null>}
 */
export const addApplytoJobById = async (
  jobId: mongoose.Types.ObjectId,
  freelancerId: string
): Promise<IJobDoc | null> => {
  try {
    const job = await Job.findOneAndUpdate({ _id: jobId }, { $push: { appliedFreelancers: freelancerId } })
    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
    }
    return await job.populate({ path: 'client', populate: { path: 'user' } })
  } catch (err) {
    throw new Error('cannot add apply to job')
  }
}

/**
 * Update block job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} freelancerId
 * @returns {Promise<IJobDoc | null>}
 */
export const addBlocktoJobById = async (
  jobId: mongoose.Types.ObjectId,
  freelancerId: string
): Promise<IJobDoc | null> => {
  const job = await getJobById(jobId)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  const blockFreelancers = job?.blockFreelancers || []
  Object.assign(job, { blockFreelancers: [...blockFreelancers, freelancerId] })
  await job.save()
  return job
}

/**
 * Update job by id
 * @param {any} options
 * @param {UpdateJobBody} updateBody
 * @returns {Promise<any | null>}
 */
export const updateMulJobByOptions = async (options: any, updateBody: UpdateJobBody): Promise<any | null> => {
  const job = await Job.updateMany(options, updateBody)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  return job
}

/**
 * Soft Delete job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @returns {Promise<IJobDoc | null>}
 */
// export const softDeleteJobById = async (jobId: mongoose.Types.ObjectId): Promise<IJobDoc | null> => {
//   const job = await Job.findById(jobId)
//     .populate({
//       path: 'proposals',
//       select: 'freelancer',
//       populate: {
//         path: 'freelancer.user',
//         select: '_id',
//       },
//     })
//     .populate({
//       path: 'client',
//       select: 'user',
//       populate: {
//         path: 'user',
//         select: '_id',
//       },
//     })

//   if (!job) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
//   }

//   const clientUserId = job.client?.user?._id

//   if (job.proposals?.length) {
//     const userUpdates = [
//       { filter: { _id: clientUserId }, update: { $inc: { jobsPoints: 2 } } },
//       ...job.proposals.map(proposal => ({
//         filter: { _id: proposal.freelancer.user._id },
//         update: { $inc: { jobsPoints: proposal.sickUsed || 2 } },
//       })),
//     ]

//     await Promise.all([
//       User.updateOne({ _id: clientUserId }, { $inc: { jobsPoints: -2 } }),
//       ...userUpdates.map(update => User.updateOne(update.filter, update.update)),
//       ...job.proposals.map(proposal =>
//         createNotify({
//           to: proposal.freelancer.user._id,
//           path: FERoutes.allProposals + (proposal._id || ''),
//           attachedId: proposal._id,
//           content: FEMessage(job.title).rejectProposalDueJobDeleted,
//         })
//       ),
//     ])
//   }

//   job.isDeleted = true
//   job.status?.push({
//     status: EJobStatus.CANCELLED,
//     comment: 'the job is deleted by its owner',
//     date: new Date(),
//   })

//   await job.save()

//   return job
// }

export const softDeleteJobById = async (jobId: mongoose.Types.ObjectId): Promise<IJobDoc | null> => {
  const job = await Job.findById(jobId)
    .populate({
      path: 'proposals',
      select: 'freelancer',
      populate: {
        path: 'freelancer',
        populate: {
          path: 'user',
          select: '_id',
        },
      },
    })
    .populate({
      path: 'client',
      select: 'user',
      populate: {
        path: 'user',
        select: '_id',
      },
    })

  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }

  const clientUserId = job.client?.user?._id

  const appInfo = await getAppInfo()

  if (job.proposals?.length) {
    const bulkOperations = [
      // { updateOne: { filter: { _id: clientUserId }, update: { $inc: { jobsPoints: 2 } } } },
      ...job.proposals.map(proposal => ({
        updateOne: {
          filter: { _id: proposal.freelancer.user._id },
          update: { $inc: { jobsPoints: proposal.sickUsed || appInfo?.freelancerSicks?.proposalCost } },
        },
      })),
    ]

    const notifyBodies = job.proposals.map(proposal => ({
      to: proposal.freelancer.user._id,
      path: FERoutes.allProposals + (proposal._id || ''),
      attachedId: proposal._id,
      content: FEMessage(job.title).rejectProposalDueJobDeleted,
    }))

    await Promise.all([
      User.updateOne({ _id: clientUserId }, { $inc: { jobsPoints: -appInfo?.clientSicks?.deleteJob } }),
      User.bulkWrite(bulkOperations),
      bulkCreateNotify(notifyBodies),
      updateProposalStatusBulk(
        job.proposals.map(p => p._id),
        EStatus.CANCELLED,
        'the job is deleted by its owner'
      ),
    ])
  }

  job.status?.push({
    status: EJobStatus.CANCELLED,
    comment: 'the job is deleted by its owner',
    date: new Date(),
  })
  job.currentStatus = EJobStatus.CANCELLED

  await job.save()

  return job
}

/**
 * Delete job by id (only for admin)
 * @param {mongoose.Types.ObjectId} jobId
 * @returns {Promise<IJobDoc | null>}
 */
export const deleteJobById = async (jobId: mongoose.Types.ObjectId): Promise<IJobDoc | null> => {
  const job = await getJobById(jobId)
  const client = await getClientByOptions({ jobs: { $in: [jobId] } })
  await softDeleteJobById(jobId)
  // deleteProposalByOptions({ job: jobId })
  if (client && job) {
    client.jobs = client?.jobs.filter(j => j !== jobId)
    client.save()
  }
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  await job.deleteOne()
  return job
}

/**
 * Change status job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} status
 * @returns {Promise<IJobDoc | null>}
 */
export const changeStatusJobById = async (
  jobId: mongoose.Types.ObjectId,
  status: EJobStatus,
  comment: string
): Promise<IJobDoc | null> => {
  const job = await Job.findById(jobId)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  if (!job?.status?.length) {
    job.status = [
      {
        status,
        comment,
        date: new Date(),
      },
    ]
  } else {
    job.status?.push({
      status,
      comment,
      date: new Date(),
    })
  }
  await job.save()
  return job
}

/**
 * Query for jobs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const getAllJobs = async (filter: Record<string, any>, options: IOptions): Promise<IJobDoc[]> => {
  const jobs = await Job.find()
    .populate([
      { path: 'client' },
      { path: 'categories' },
      { path: 'reqSkills.skill' },
      { path: 'proposals', populate: 'freelancer' },
    ])
    .lean()
  return jobs
}

/**
 * check is job opened by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {IProposalDoc} proposal
 * @returns {Promise<boolean | null>}
 */
export const isJobOpened = async (
  jobId: mongoose.Types.ObjectId,
  proposal: IProposalDoc,
  isCreatedJob: boolean = true
): Promise<boolean | null> => {
  const job = await Job.findById(jobId)
  let check = true
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }

  if (isCreatedJob) {
    if (job?.questions?.length > 0) {
      if (!proposal?.answers) {
        check = false
      } else if (job?.questions?.length !== Object.keys(proposal?.answers || {}).length) {
        check = false
      }
    }
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (job?.proposals?.length * job?.preferences?.nOEmployee >= 15 * job?.preferences?.nOEmployee) {
      check = false
    }

    if (
      job?.appliedFreelancers?.includes(proposal.freelancer) ||
      job?.blockFreelancers?.includes(proposal.freelancer)
    ) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'This user already applied or is not allowed to apply this job')
    }
  }

  if (!(job?.currentStatus === EJobStatus.PENDING || job?.currentStatus === EJobStatus.OPEN)) {
    check = false
  }

  return check
}

export const verifyJob = async (jobId: mongoose.Types.ObjectId): Promise<IJobDoc> => {
  try {
    const job = await Job.findById(jobId)
    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found client')
    }

    const client = await getClientById(job.client)
    if (!client) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found client')
    }
    // if (!client?.paymentVerified) {
    const verifiedJob = await changeStatusJobById(job.id, EJobStatus.OPEN, 'Accepted by Admin')
    // }
    // const createdJob = await Job.create(job)

    createNotify({
      to: client.user._id,
      path: FERoutes.jobDetail + (verifiedJob._id || ''),
      attachedId: verifiedJob._id,
      content: FEMessage(verifiedJob.title).jobVerified,
    })

    if (client?.paymentVerified) {
      const followedFreelancer = await Freelancer.find({ favoriteClients: { $in: [client?._id] } }).populate('user')
      const notifyBodies = followedFreelancer?.map(f => ({
        to: f.user._id,
        path: `/job-details/${verifiedJob._id || ''}`,
        attachedId: verifiedJob._id,
        content: FEMessage(verifiedJob.title).newJobCreated,
      }))
      bulkCreateNotify(notifyBodies)
    }
    // client.jobs = client.jobs.concat(createdJob._id)
    // client.save()
    // return createdJob

    return verifiedJob
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `cannot create job ${error}`)
  }
}
