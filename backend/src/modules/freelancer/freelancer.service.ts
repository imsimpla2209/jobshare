/* eslint-disable import/no-named-as-default */
/* eslint-disable prefer-const */
/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-computed-key */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import queryGen from '@core/libs/queryGennerator'
import { IJobDoc } from '@modules/job/job.interfaces'
import Job, { JobCategory, JobTag } from '@modules/job/job.model'
import { addApplytoJobById, getJobById, getJobsByOptions } from '@modules/job/job.service'
import { Skill } from '@modules/skill'
import { IReview } from 'common/interfaces/subInterfaces'
import { logger } from 'common/logger'
import httpStatus from 'http-status'
import keywordExtractor from 'keyword-extractor'
import { union } from 'lodash'
import mongoose from 'mongoose'
import { createFuzzyRegex, extractKeywords } from 'utils/helperFunc'
import { createNotify } from '@modules/notify/notify.service'
import { FEMessage } from 'common/enums/constant'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import {
  IFreelancerDoc,
  ISimilarFreelancer,
  NewRegisteredFreelancer,
  UpdateFreelancerBody,
} from './freelancer.interfaces'
import Freelancer, { SimilarFreelancer } from './freelancer.model'
import FreelancerTracking from './freelancer.tracking.model'

/**
 * Register a freelancer
 * @param {mongoose.Types.ObjectId} freelancerBody
 * @param {NewRegisteredFreelancer} freelancerBody
 * @returns {Promise<IFreelancerDoc>}
 */
export const registerFreelancer = async (
  userId: mongoose.Types.ObjectId,
  freelancerBody: NewRegisteredFreelancer
): Promise<IFreelancerDoc> => {
  // const user = await getUserById(userId)
  // if (!user.isVerified) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, `User is not verified`)
  // }
  if (await Freelancer.findOne({ user: freelancerBody.user })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Freelancer')
  }
  let profileCompletion = 0
  if (freelancerBody?.skills?.length > 0) profileCompletion += 10
  if (freelancerBody?.preferJobType?.length > 0) profileCompletion += 10
  if (freelancerBody?.intro) profileCompletion += 10
  return Freelancer.create({ ...freelancerBody, profileCompletion })
}

/**
 * Query for freelancers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryFreelancers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const freelancers = await Freelancer.paginate(filter, options)
  return freelancers
}

/**
 * Advanced Query for freelancers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryAdvancedFreelancers = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  filter['name'] && (filter['name'] = { $regex: `${filter['name']}`, $options: 'i' })
  if (filter['id']?.length) {
    filter['_id'] = { $in: filter['id'] }
    delete filter['id']
  }
  filter['intro'] && (filter['intro'] = { $regex: `${filter['intro']}`, $options: 'i' })

  if (filter['skills']) {
    filter['skills.skill'] = { $in: filter['skills'].map(item => new mongoose.Types.ObjectId(item)) }
    delete filter['skills']
  }

  filter['preferJobType'] && (filter['preferJobType'] = { $in: filter['preferJobType'] })
  filter['currentLocations'] && (filter['currentLocations'] = { $in: filter['currentLocations'] })
  filter['categories'] && (filter['categories'] = { $in: filter['categories'] })
  filter['tags'] && (filter['tags'] = { $in: filter['tags'] })

  filter['jobsDone.number'] &&
    (filter['jobsDone.number'] = queryGen.numRanges(filter['jobsDone.number']?.from, filter['jobsDone.number']?.to))
  filter['jobsDone.success'] &&
    (filter['jobsDone.success'] = queryGen.numRanges(filter['jobsDone.success']?.from, filter['jobsDone.success']?.to))
  filter['earned'] && (filter['earned'] = queryGen.numRanges(filter['earned']?.from, filter['earned']?.to))
  filter['rating'] && (filter['rating'] = queryGen.numRanges(filter['rating']?.from, filter['rating']?.to))

  options.populate = 'user,preferJobType,skills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'user, name, intro, members, skills, currentLocations, rating, jobsDone, available, earned, expectedAmount,expectedPaymentType'
  }
  const freelancers = await Freelancer.paginate(filter, options)
  return freelancers
}

/**
 * search freelancers by text
 * @param {string} searchText - text
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const searchFreelancersByText = async (searchText: string, options: IOptions): Promise<QueryResult> => {
  const foundCats = await JobCategory.find({ name: { $regex: searchText, $options: 'i' } })
  const foundSkills = await Skill.find({ name: { $regex: searchText, $options: 'i' } })

  const filter = {
    $and: [
      {
        $or: [
          { name: { $search: searchText, $diacriticSensitive: true } },
          { intro: { $regex: searchText, $options: 'i' } },
          { preferJobType: { $in: foundCats || [] } },
          { 'skills.skill': { $in: foundSkills || [] } },
        ],
      },
      { isDeleted: { $ne: true } },
    ],
  }

  options.populate = 'user,preferJobType,skills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'user, name, intro, members, skills.skill, preferJobType, currentLocations, rating, jobsDone, available, earned'
  }

  const jobs = await Freelancer.paginate(filter, options)
  return jobs
}

/**
 * manually get recommended freelancer based on job(low level vcl)
 * @param {string} jobId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const getRcmdFreelancers = async (jobId: mongoose.Types.ObjectId, options: IOptions): Promise<QueryResult> => {
  // const similarDocs = await getSimilarsByOptions(freelancerId)
  const job = await getJobById(jobId)

  if (!job) return null
  console.log('😘', job)
  let keyWords

  if (job.description) {
    keyWords = keywordExtractor.extract(job.description, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    })

    keyWords = keyWords.map(k => `.*${k}.*`).join('|')
  }

  keyWords.concat(
    keywordExtractor
      .extract(job.title, {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      })
      .map(k => `.*${k}.*`)
      .join('|')
  )

  keyWords = new RegExp(keyWords, 'i')

  const filter = {
    $or: [
      { intro: { $regex: keyWords, $options: 'i' } },
      { preferJobType: { $in: job.categories || [] } },
      { skills: { $in: job.reqSkills || [] } },
      // { tags: { $in: similarDocs.similarTags || [] } },
      { currentLocations: { $in: job.preferences?.locations || [] } },
      { member: { $gte: job.preferences?.nOEmployee } },
    ],
  }

  const ids = await SimilarFreelancer.find(filter)

  const queryFilter = { _id: { $in: ids } }

  options.populate = 'user,preferJobType,skills.skill'
  options.limit = 30
  if (!options.projectBy) {
    options.projectBy =
      'user, name, intro, members, skills.skill, preferJobType, currentLocations, rating, jobsDone, available, earned'
  }

  const freelancers = await Freelancer.paginate(queryFilter, options)
  return freelancers
}

/**
 * Get freelancer by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerById = async (id: mongoose.Types.ObjectId): Promise<IFreelancerDoc | null> =>
  Freelancer.findById(id).populate('skills.skill').populate('preferJobType')

/**
 * Get freelancer by id with populate
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByIdWithPopulate = async (
  id: mongoose.Types.ObjectId,
  populate?: string[]
): Promise<IFreelancerDoc | null> =>
  Freelancer.findById(id).populate(['user', 'preferJobType', 'skills.skill', 'proposals'])

/**
 * Get freelancer by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByUserId = async (userId: mongoose.Types.ObjectId): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ user: userId, isDeleted: { $ne: true } })

/**
 * Get freelancer by freelancername
 * @param {string} freelancername
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByFreelancerName = async (freelancername: string): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ freelancername, isDeleted: { $ne: true } })

/**
 * Get freelancer by email
 * @param {string} email
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByEmail = async (email: string): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ email, isDeleted: { $ne: true } })

/**
 * Get freelancer by option
 * @param {object} options
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByOptions = async (Options: any): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ ...Options, isDeleted: { $ne: true } })
    .lean()
    .populate('preferJobType')
    .populate('skills.skill')
    .exec()

/**
 * Update freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {UpdateFreelancerBody} updateBody
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const updateFreelancerById = async (
  freelancerId: mongoose.Types.ObjectId,
  updateBody: UpdateFreelancerBody
): Promise<IFreelancerDoc | null> => {
  const freelancer = await getFreelancerById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  Object.assign(freelancer, updateBody)
  await freelancer.save()
  return freelancer
}

/**
 * Verify freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {UpdateFreelancerBody} updateBody
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const verifyFreelancerById = async (freelancerId: mongoose.Types.ObjectId): Promise<IFreelancerDoc | null> => {
  const freelancer = await Freelancer.findById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  Object.assign(freelancer, {
    isProfileVerified: true,
  })
  createNotify({
    to: freelancer?.user,
    path: `/profile/me`,
    content: FEMessage().profileVerified,
  })
  await freelancer.save()
  return freelancer
}

/**
 * create freelancer profile by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {UpdateFreelancerBody} updateBody
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const createFreelancerProfileById = async (
  freelancerId: mongoose.Types.ObjectId,
  updateBody: UpdateFreelancerBody
): Promise<IFreelancerDoc | null> => {
  const freelancer = await getFreelancerById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const requiredFields = [
    'title',
    'intro',
    'skills',
    'preferJobType',
    'currentLocations',
    'available',
    'expertiseLevel',
    'education',
    'historyWork',
    'englishProficiency',
    'otherLanguages',
    'expectedAmount',
    'expectedPaymentType',
  ]
  let completion = 0
  requiredFields.forEach(field => {
    if (updateBody && updateBody[field]) {
      completion += 1
    }
  })
  const totalFields = requiredFields.length
  const profileCompletionPercent = (completion / totalFields) * 100
  const projectCompletionPercent = Math.max(10, Math.min(100, profileCompletionPercent))
  if (!updateBody['profileCompletion']) {
    updateBody['profileCompletion'] = projectCompletionPercent
  }
  if (!updateBody['isSubmitProfile']) {
    updateBody['isSubmitProfile'] = true
  }
  Object.assign(freelancer, updateBody)
  await freelancer.save()
  return freelancer
}

/**
 * Delete freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const deleteFreelancerById = async (freelancerId: mongoose.Types.ObjectId): Promise<IFreelancerDoc | null> => {
  const freelancer = await getFreelancerById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  await freelancer.deleteOne()
  return freelancer
}

/**
 * review freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {IReview} review
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const reviewFreelancerById = async (
  freelancerId: mongoose.Types.ObjectId,
  review: IReview
): Promise<IFreelancerDoc | null> => {
  const freelancer = await getFreelancerById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  freelancer['reviews'] = [...freelancer?.reviews, review]
  await freelancer.save()
  return freelancer
}

/**
 * add proposals to freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {String} proposalId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const addProposaltoFreelancerById = async (
  freelancerId: mongoose.Types.ObjectId,
  proposalId: string
): Promise<IFreelancerDoc | null> => {
  try {
    const freelancer = await Freelancer.findOneAndUpdate({ _id: freelancerId }, { $push: { proposals: proposalId } })
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }
    return await freelancer.populate('user')
  } catch (err) {
    throw new Error(`cannot add proposals to freelancer ${err}`)
  }
}

export const updateSimilarData = (
  freelancerJobs: IJobDoc[] = [],
  foundCats: any[] = [],
  foundSkills: any[] = [],
  preferLocation: any[] = [],
  newDescription = '',
  similarClients: any[] = []
) => {
  const updatedData = {
    foundCats,
    foundSkills,
    foundLocations: preferLocation,
    newDescription,
    foundClients: similarClients,
  }

  freelancerJobs.forEach(job => {
    if (job?.categories?.length) {
      updatedData.foundCats = union(
        updatedData.foundCats,
        job.categories.map(c => c?._id?.toString() || c)
      )
    }
    if (job?.reqSkills?.length) {
      updatedData.foundSkills = union(
        updatedData.foundSkills,
        job.reqSkills.map(c => c?.skill?._id?.toString() || c?.skill?.toString())
      )
    }
    // if (job?.preferences?.locations?.length) {
    //   updatedData.foundLocations = union(updatedData.foundLocations, job.preferences.locations)
    // }
    updatedData.newDescription += `${job?.description} ${job?.title}`
    updatedData.foundClients = union(updatedData.foundClients, [
      job?.client?._id?.toString() || job?.client?.toString(),
    ])
  })

  return updatedData
}

/**
 * update similar info for freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const updateSimilarById = async (freelancerId: mongoose.Types.ObjectId): Promise<any | null> => {
  try {
    const freelancer = await Freelancer.findById(freelancerId)
      .populate(['favoriteJobs'])
      .populate(['jobs'])
      .populate({
        path: 'proposals',
        populate: { path: 'job' },
      })
      .populate({
        path: 'relevantClients',
        populate: { path: 'jobs' },
      })
      .lean()

    if (!freelancer) {
      throw new Error('Freelancer not found')
    }

    let initialSimilarDocs: any = {
      foundJobs: [],
      foundClients: [],
      foundLocations: [],
      foundCats: [],
      foundSkills: [],
      newDescription: '',
    }

    let potentialJobs = []
    let potentialCats = []
    let potentialSkills = []

    initialSimilarDocs.foundLocations = freelancer?.currentLocations

    initialSimilarDocs.foundClients = union(
      freelancer?.relevantClients?.map(c => c?._id?.toString()) || [],
      freelancer?.favoriteClients?.map(c => c?._id?.toString()) || []
    )

    potentialCats = union(potentialCats, freelancer?.preferJobType)
    potentialSkills = union(
      potentialSkills,
      freelancer?.skills.map(sk => sk.skill?.toString())
    )

    let similarJobs: any[] = []

    if (freelancer?.jobs?.length) {
      potentialJobs = union(potentialJobs, [...freelancer.jobs])
    }
    if (freelancer?.proposals?.length) {
      const appliedJobs = freelancer.proposals.map(p => p.job)
      potentialJobs = union(potentialJobs, [...appliedJobs])
    }
    if (freelancer?.favoriteJobs) {
      potentialJobs = union(potentialJobs, [...freelancer.favoriteJobs])
    }

    potentialJobs
      ?.filter(
        j =>
          j?.preferences?.locations?.includes(initialSimilarDocs.similarLocations) ||
          j?.reqSkills?.map(s => potentialSkills?.includes(s?.skill?.toString())) ||
          j?.categories?.includes(potentialCats)
      )
      ?.forEach(job => {
        if (job?.categories?.length) {
          potentialCats = union(
            potentialCats,
            job.categories.map(c => c?._id?.toString() || c)
          )
        }
        if (job?.reqSkills?.length) {
          potentialSkills = union(
            potentialSkills,
            job.reqSkills.map(c => c?.skill?._id?.toString() || c?.skill?.toString())
          )
        }
        if (job?.preferences?.locations?.length) {
          initialSimilarDocs.similarLocations = union(initialSimilarDocs.similarLocations, job.preferences.locations)
        }
        initialSimilarDocs.newDescription += `${job?.description} ${job?.title}`
        initialSimilarDocs.foundClients = union(initialSimilarDocs.foundClients, [
          job?.client?._id?.toString() || job?.client?.toString(),
        ])
      })

    if (freelancer?.relevantClients) {
      // const freelancerJobs = await getJobsByOptions({ client: { $in: freelancer?.relevantClients?.map(c => c?._id) } })
      // similarJobs = union(similarJobs, [...freelancerJobs])
      freelancer?.relevantClients?.forEach(e => {
        initialSimilarDocs.foundCats = union(initialSimilarDocs.foundCats, e?.preferJobType || [])

        similarJobs = union(similarJobs, e?.jobs)

        initialSimilarDocs.foundLocations = union(initialSimilarDocs.foundLocations, e?.preferLocations)
        initialSimilarDocs.newDescription += `${e?.intro}`
      })
    }

    if (freelancer?.favoriteClients) {
      freelancer?.favoriteClients?.forEach(e => {
        initialSimilarDocs.foundCats = union(initialSimilarDocs.foundCats, e?.preferJobType || [])

        similarJobs = union(similarJobs, e?.jobs)

        initialSimilarDocs.foundLocations = union(initialSimilarDocs.foundLocations, e?.preferLocations)
        initialSimilarDocs.newDescription += `${e?.intro}`
      })
    }

    initialSimilarDocs = updateSimilarData(
      similarJobs?.filter(
        j =>
          (j?.preferences?.locations?.includes(initialSimilarDocs.similarLocations) &&
            j?.reqSkills?.map(s => initialSimilarDocs?.similarSkills?.includes(s?.skill?.toString()))) ||
          j?.reqSkills?.map(s => initialSimilarDocs?.similarSkills?.includes(s?.skill?.toString())) ||
          j?.categories?.includes(initialSimilarDocs.similarJobCats) ||
          (j?.categories?.includes(initialSimilarDocs.similarJobCats) &&
            j?.preferences?.locations?.includes(initialSimilarDocs.similarLocations))
      ),
      initialSimilarDocs.foundCats,
      initialSimilarDocs.foundSkills,
      initialSimilarDocs.foundLocations,
      initialSimilarDocs.newDescription,
      initialSimilarDocs.foundClients
    )

    const keyWords = extractKeywords(`${freelancer?.intro} ${initialSimilarDocs.newDescription}`)

    logger.info('Extracted Keywords', keyWords)

    const similarRegex = createFuzzyRegex(keyWords)

    // const foundExtraCats: any[] = await JobCategory.find({ name: { $regex: `${similarRegex}`, $options: 'si' } })
    // const foundExtraSkills: any[] = (await Skill.find({ name: { $regex: `${similarRegex}`, $options: 'si' } })) || []

    const extraSimilarSkills = await Promise.all(
      initialSimilarDocs.foundSkills?.filter(sk => sk?.category)?.map(sk => Skill.find({ category: sk?.category }))
    )

    const foundTags = await JobTag.find({ name: { $regex: `${similarRegex}`, $options: 'si' } })

    // initialSimilarDocs.foundCats = union(
    //   initialSimilarDocs.foundCats,
    //   foundExtraCats?.map(c => c?._id?.toString()) || []
    // )

    initialSimilarDocs.foundSkills = union(
      initialSimilarDocs.foundSkills || [],
      // foundExtraSkills?.map(sk => sk?._id?.toString()) || [],
      [].concat(...extraSimilarSkills)?.map(sk => sk?._id?.toString())
    )

    logger.info('Similar Doc', initialSimilarDocs)

    let similarDoc = await SimilarFreelancer.findOne({
      freelancer: freelancer._id,
    })
    if (similarDoc) {
      similarDoc.similarJobCats = [
        ...new Set(
          union(
            initialSimilarDocs?.foundCats?.filter(c => !!c),
            similarDoc?.similarJobCats || []
          )
        ),
      ]
      similarDoc.similarSkills = [
        ...new Set(
          union(
            initialSimilarDocs?.foundSkills?.filter(s => !!s),
            similarDoc?.similarSkills || []
          )
        ),
      ]
      similarDoc.similarLocations = union(similarDoc.similarLocations, initialSimilarDocs?.foundLocations || [])
      similarDoc.potentialJobCats = [
        ...new Set(
          union(
            potentialCats?.filter(c => !!c),
            similarDoc?.potentialJobCats || []
          )
        ),
      ]
      similarDoc.potentialSkills = [
        ...new Set(
          union(
            potentialSkills?.filter(s => !!s),
            similarDoc?.potentialSkills || []
          )
        ),
      ]

      similarDoc.similarKeys = similarRegex?.toString()
      similarDoc.similarClients = union(initialSimilarDocs.foundClients, similarDoc?.similarClients || [])
    } else if (!similarDoc) {
      similarDoc = new SimilarFreelancer({
        freelancer: freelancer._id,
        similarKeys: similarRegex?.toString(),
        similarJobCats: [...new Set(initialSimilarDocs?.foundCats?.filter(c => !!c))],
        similarLocations: initialSimilarDocs?.foundLocations,
        similarSkills: [...new Set(initialSimilarDocs?.foundSkills?.filter(s => !!s))],
        potentialJobCats: [...new Set(potentialCats)],
        potentialSkills: [...new Set(potentialSkills)],
        similarTags: foundTags || [],
        similarClients: initialSimilarDocs.foundClients,
      })
    }

    await similarDoc.save()

    return similarDoc
  } catch (error: any) {
    logger.error(`update similar freelancer Doc error ${error?.message}`)
    throw new ApiError(httpStatus.BAD_GATEWAY, `update similar freelancer Doc error ${error?.message}`)
  }
}

/**
 * Update apply job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} freelancerId
 * @param {string} clientId
 * @returns {Promise<IJobDoc | null>}
 */
export const addJobtoFreelancer = async (
  jobId: mongoose.Types.ObjectId,
  freelancerId: mongoose.Types.ObjectId,
  clientId: mongoose.Types.ObjectId
): Promise<IFreelancerDoc | null> => {
  try {
    addApplytoJobById(jobId, freelancerId.toString())
    const freelancer = await getFreelancerById(new mongoose.Types.ObjectId(freelancerId))
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'freelancer not found')
    }
    const jobs = freelancer?.jobs ? [...freelancer.jobs, jobId] : [jobId]
    const relevantClients = freelancer?.relevantClients ? [...freelancer.relevantClients, clientId] : [clientId]
    freelancer.jobsDone.number = (freelancer?.jobsDone?.number ?? 0) + 1
    freelancer['jobs'] = jobs
    freelancer['relevantClients'] = relevantClients

    await freelancer.save()

    return freelancer
  } catch (err) {
    throw new Error('cannot add job to freelancer')
  }
}

/**
 * Get similar by freelancer id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getSimilarByFreelancerId = async (id: mongoose.Types.ObjectId): Promise<ISimilarFreelancer | null> =>
  SimilarFreelancer.findOne({ freelancer: id })

/**
 * Get similars by options
 * @param {any} options
 * @returns {Promise<IFreelancerDoc | null>}
 */
export async function getSimilarsByOptions(options: any): Promise<ISimilarFreelancer[] | null> {
  return SimilarFreelancer.find(options)
}

/**
 * Soft Delete freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const softDeleteFreelancerById = async (
  freelancerId: mongoose.Types.ObjectId
): Promise<IFreelancerDoc | null> => {
  const freelancer = await Freelancer.findByIdAndUpdate(freelancerId, { isDeleted: true })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  return freelancer
}

export const getTopCurrentTypeTracking = async (freelancer: IFreelancerDoc, limit?: number) => {
  const freelancerId = freelancer?._id?.toString()

  try {
    const categoryRankings = await FreelancerTracking.aggregate([
      { $match: { freelancer: freelancerId } },
      { $unwind: '$categories' },
      {
        $project: {
          _id: 0,
          category: '$categories.id',
          totalPoints: {
            $add: [
              // APPLY event (70%)
              { $multiply: ['$categories.event.APPLY.viewCount', 0.7] },
              { $multiply: ['$categories.event.APPLY.totalTimeView', 0.7] },
              // JOB_VIEW event (55%)
              { $multiply: ['$categories.event.JOB_VIEW.viewCount', 0.55] },
              { $multiply: ['$categories.event.JOB_VIEW.totalTimeView', 0.55] },
              // VIEWCLIENT event (45%)
              { $multiply: ['$categories.event.VIEWCLIENT.viewCount', 0.45] },
              { $multiply: ['$categories.event.VIEWCLIENT.totalTimeView', 0.45] },
              // SEARCHING event (35%)
              { $multiply: ['$categories.event.SEARCHING.viewCount', 0.35] },
              { $multiply: ['$categories.event.SEARCHING.totalTimeView', 0.35] },
            ],
          },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: limit || 5 },
    ]).exec()

    const skillRankings = await FreelancerTracking.aggregate([
      { $match: { freelancer: freelancerId } },
      { $unwind: '$skills' },
      {
        $project: {
          _id: 0,
          skill: '$skills.id',
          totalPoints: {
            $add: [
              // APPLY event (70%)
              { $multiply: ['$skills.event.APPLY.viewCount', 0.7] },
              { $multiply: ['$skills.event.APPLY.totalTimeView', 0.7] },
              // JOB_VIEW event (55%)
              { $multiply: ['$skills.event.JOB_VIEW.viewCount', 0.55] },
              { $multiply: ['$skills.event.JOB_VIEW.totalTimeView', 0.55] },
              // VIEWCLIENT event (45%)
              { $multiply: ['$skills.event.VIEWCLIENT.viewCount', 0.45] },
              { $multiply: ['$skills.event.VIEWCLIENT.totalTimeView', 0.45] },
              // SEARCHING event (35%)
              { $multiply: ['$skills.event.SEARCHING.viewCount', 0.35] },
              { $multiply: ['$skills.event.SEARCHING.totalTimeView', 0.35] },
            ],
          },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: limit || 5 },
    ]).exec()

    return { categoryRankings, skillRankings }
  } catch (err: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot fetch top current tracking: ${err.message}`)
  }
}

export const getTopTrackingPoint = async (freelancer: IFreelancerDoc, limit?: number) => {
  const freelancerId = freelancer?._id?.toString()

  try {
    const categoryRankings = await FreelancerTracking.aggregate([
      { $match: { freelancer: freelancerId } },
      { $unwind: '$categories' },
      {
        $project: {
          _id: 0,
          category: '$categories.id',
          totalPoints: {
            $add: [
              // APPLY event (70%)
              { $multiply: ['$categories.event.APPLY.viewCount', 0.7] },
              { $multiply: ['$categories.event.APPLY.totalTimeView', 0.7] },
              // JOB_VIEW event (55%)
              { $multiply: ['$categories.event.JOB_VIEW.viewCount', 0.55] },
              { $multiply: ['$categories.event.JOB_VIEW.totalTimeView', 0.55] },
              // VIEWCLIENT event (45%)
              { $multiply: ['$categories.event.VIEWCLIENT.viewCount', 0.45] },
              { $multiply: ['$categories.event.VIEWCLIENT.totalTimeView', 0.45] },
              // SEARCHING event (35%)
              { $multiply: ['$categories.event.SEARCHING.viewCount', 0.35] },
              { $multiply: ['$categories.event.SEARCHING.totalTimeView', 0.35] },
            ],
          },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: limit || 3 },
    ]).exec()

    const jobRankings = await FreelancerTracking.aggregate([
      { $match: { freelancer: freelancerId } },
      { $unwind: '$jobs' },
      {
        $project: {
          _id: 0,
          category: '$jobs.id',
          totalPoints: {
            $add: [
              // APPLY event (70%)
              { $multiply: ['$jobs.event.APPLY.viewCount', 0.7] },
              { $multiply: ['$jobs.event.APPLY.totalTimeView', 0.7] },
              // JOB_VIEW event (55%)
              { $multiply: ['$jobs.event.JOB_VIEW.viewCount', 0.55] },
              { $multiply: ['$jobs.event.JOB_VIEW.totalTimeView', 0.55] },
              // VIEWCLIENT event (45%)
              { $multiply: ['$jobs.event.VIEWCLIENT.viewCount', 0.45] },
              { $multiply: ['$jobs.event.VIEWCLIENT.totalTimeView', 0.45] },
              // SEARCHING event (35%)
              { $multiply: ['$jobs.event.SEARCHING.viewCount', 0.35] },
              { $multiply: ['$jobs.event.SEARCHING.totalTimeView', 0.35] },
            ],
          },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: limit || 3 },
    ]).exec()

    const skillRankings = await FreelancerTracking.aggregate([
      { $match: { freelancer: freelancerId } },
      { $unwind: '$skills' },
      {
        $project: {
          _id: 0,
          skill: '$skills.id',
          totalPoints: {
            $add: [
              // APPLY event (70%)
              { $multiply: ['$skills.event.APPLY.viewCount', 0.7] },
              { $multiply: ['$skills.event.APPLY.totalTimeView', 0.7] },
              // JOB_VIEW event (55%)
              { $multiply: ['$skills.event.JOB_VIEW.viewCount', 0.55] },
              { $multiply: ['$skills.event.JOB_VIEW.totalTimeView', 0.55] },
              // VIEWCLIENT event (45%)
              { $multiply: ['$skills.event.VIEWCLIENT.viewCount', 0.45] },
              { $multiply: ['$skills.event.VIEWCLIENT.totalTimeView', 0.45] },
              // SEARCHING event (35%)
              { $multiply: ['$skills.event.SEARCHING.viewCount', 0.35] },
              { $multiply: ['$skills.event.SEARCHING.totalTimeView', 0.35] },
            ],
          },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: limit || 3 },
    ]).exec()

    return { categoryRankings, skillRankings, jobRankings }
  } catch (err: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot fetch top current tracking: ${err.message}`)
  }
}

export const getLastestTopJobs = async (freelancer: IFreelancerDoc, limit?: number) => {
  const freelancerId = freelancer?._id?.toString()

  try {
    const currentViewJobRanking = await FreelancerTracking.aggregate([
      { $match: { freelancer: freelancerId } },
      { $unwind: '$jobs' },
      {
        $project: {
          _id: 0,
          job: '$jobs.id',
          totalPoints: {
            $add: [
              // APPLY event (70%)
              { $multiply: ['$jobs.event.APPLY.viewCount', 0.7] },
              { $multiply: ['$jobs.event.APPLY.totalTimeView', 0.7] },
              // JOB_VIEW event (55%)
              { $multiply: ['$jobs.event.JOB_VIEW.viewCount', 0.55] },
              { $multiply: ['$jobs.event.JOB_VIEW.totalTimeView', 0.55] },
              // VIEWCLIENT event (45%)
              { $multiply: ['$jobs.event.VIEWCLIENT.viewCount', 0.45] },
              { $multiply: ['$jobs.event.VIEWCLIENT.totalTimeView', 0.45] },
              // SEARCHING event (35%)
              { $multiply: ['$jobs.event.SEARCHING.viewCount', 0.35] },
              { $multiply: ['$jobs.event.SEARCHING.totalTimeView', 0.35] },
            ],
          },
          timeDifference: {
            $divide: [{ $subtract: [new Date(), { $toDate: { $toLong: '$jobs.lastTimeView' } }] }, 3600000],
          },
        },
      },
      {
        $project: {
          job: 1,
          totalPoints: 1,
          adjustedPoints: {
            $add: [
              '$totalPoints',
              {
                $multiply: [
                  '$totalPoints',
                  {
                    $min: [
                      1,
                      {
                        $divide: [
                          1,
                          {
                            $sum: [1, '$timeDifference'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      { $sort: { adjustedPoints: -1 } },
      { $limit: limit || 5 },
      // { $sort: { totalPoints: -1 } },
    ]).exec()

    const fullfillJobs = await Job.populate(
      currentViewJobRanking?.map(item => ({ ...item, job: new mongoose.Types.ObjectId(item.job) })),
      [{ path: 'job' }]
    )

    return fullfillJobs
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot fetch top current tracking: ${error}`)
  }
}

export const getLastestTopCurrentTypeTracking = async (freelancer: IFreelancerDoc, limit?: number) => {
  const freelancerId = freelancer?._id?.toString()

  try {
    const categoryRankings = await FreelancerTracking.aggregate([
      { $match: { freelancer: freelancerId } },
      { $unwind: '$categories' },
      {
        $project: {
          _id: 0,
          category: '$categories.id',
          totalPoints: {
            $add: [
              // APPLY event (70%)
              { $multiply: ['$categories.event.APPLY.viewCount', 0.7] },
              { $multiply: ['$categories.event.APPLY.totalTimeView', 0.7] },
              // JOB_VIEW event (55%)
              { $multiply: ['$categories.event.JOB_VIEW.viewCount', 0.55] },
              { $multiply: ['$categories.event.JOB_VIEW.totalTimeView', 0.55] },
              // VIEWCLIENT event (45%)
              { $multiply: ['$categories.event.VIEWCLIENT.viewCount', 0.45] },
              { $multiply: ['$categories.event.VIEWCLIENT.totalTimeView', 0.45] },
              // SEARCHING event (35%)
              { $multiply: ['$categories.event.SEARCHING.viewCount', 0.35] },
              { $multiply: ['$categories.event.SEARCHING.totalTimeView', 0.35] },
            ],
          },
          timeDifference: {
            $divide: [{ $subtract: [new Date(), { $toDate: { $toLong: '$categories.lastTimeView' } }] }, 3600000],
          },
        },
      },
      {
        $project: {
          category: 1,
          totalPoints: 1,
          withTimePoints: {
            $add: [
              '$totalPoints',
              {
                $multiply: [
                  '$totalPoints',
                  {
                    $min: [
                      1,
                      {
                        $divide: [
                          1,
                          {
                            $sum: [1, '$timeDifference'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      { $sort: { withTimePoints: -1 } },
      { $limit: limit || 5 },
      // { $sort: { totalPoints: -1 } },
    ]).exec()

    const skillRankings = await FreelancerTracking.aggregate([
      { $match: { freelancer: freelancerId } },
      { $unwind: '$skills' },
      {
        $project: {
          _id: 0,
          skill: '$skills.id',
          totalPoints: {
            $add: [
              // APPLY event (70%)
              { $multiply: ['$skills.event.APPLY.viewCount', 0.7] },
              { $multiply: ['$skills.event.APPLY.totalTimeView', 0.7] },
              // JOB_VIEW event (55%)
              { $multiply: ['$skills.event.JOB_VIEW.viewCount', 0.55] },
              { $multiply: ['$skills.event.JOB_VIEW.totalTimeView', 0.55] },
              // VIEWCLIENT event (45%)
              { $multiply: ['$skills.event.VIEWCLIENT.viewCount', 0.45] },
              { $multiply: ['$skills.event.VIEWCLIENT.totalTimeView', 0.45] },
              // SEARCHING event (35%)
              { $multiply: ['$skills.event.SEARCHING.viewCount', 0.35] },
              { $multiply: ['$skills.event.SEARCHING.totalTimeView', 0.35] },
            ],
          },
          timeDifference: {
            $divide: [{ $subtract: [new Date(), { $toDate: { $toLong: '$skills.lastTimeView' } }] }, 3600000],
          },
        },
      },
      {
        $project: {
          skill: 1,
          totalPoints: 1,
          withTimePoints: {
            $add: [
              '$totalPoints',
              {
                $multiply: [
                  '$totalPoints',
                  {
                    $min: [
                      1,
                      {
                        $divide: [
                          1,
                          {
                            $sum: [1, '$timeDifference'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      { $sort: { withTimePoints: -1 } },
      { $limit: limit || 5 },
      // { $sort: { totalPoints: -1 } },
    ]).exec()

    return { categoryRankings, skillRankings }
  } catch (err: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot fetch top current tracking: ${err.message}`)
  }
}

export const getFreelancerIntend = async (freelancer: IFreelancerDoc, limit?: number) => {
  const freelancerId = freelancer?._id?.toString()

  try {
    const freelancerIntend = await FreelancerTracking.aggregate([
      { $match: { freelancer: freelancerId } },
      {
        $project: {
          data: {
            $objectToArray: '$$ROOT',
          },
        },
      },
      {
        $unwind: '$data',
      },
      {
        $match: {
          'data.k': {
            $in: ['categories', 'skills', 'jobs', 'locations'],
          },
        },
      },
      {
        $unwind: '$data.v',
      },
      {
        $project: {
          type: '$data.k',
          events: {
            $objectToArray: '$data.v.event',
          },
        },
      },
      {
        $unwind: '$events',
      },
      {
        $group: {
          _id: {
            type: '$type',
            event: '$events.k',
          },
          totalViewCount: { $sum: '$events.v.viewCount' },
          totalTotalTimeView: { $sum: '$events.v.totalTimeView' },
        },
      },
      {
        $group: {
          _id: '$_id.type',
          events: {
            $push: {
              eventType: '$_id.event',
              eventData: {
                totalViewCount: '$totalViewCount',
                totalTotalTimeView: '$totalTotalTimeView',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          events: {
            $map: {
              input: '$events',
              as: 'event',
              in: {
                eventType: '$$event.eventType',
                eventData: {
                  totalViewCount: '$$event.eventData.totalViewCount',
                  totalTotalTimeView: '$$event.eventData.totalTotalTimeView',
                  weightedScore: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ['$$event.eventType', 'APPLY'] },
                          then: { $multiply: ['$$event.eventData.totalViewCount', 1.8] }, // 80% more
                        },
                        {
                          case: { $eq: ['$$event.eventType', 'JOB_VIEW'] },
                          then: { $multiply: ['$$event.eventData.totalViewCount', 1.65] }, // 65% more
                        },
                        {
                          case: { $eq: ['$$event.eventType', 'VIEWCLIENT'] },
                          then: { $multiply: ['$$event.eventData.totalViewCount', 1.5] }, // 50% more
                        },
                        {
                          case: { $eq: ['$$event.eventType', 'SEARCHING'] },
                          then: { $multiply: ['$$event.eventData.totalViewCount', 1.35] }, // 35% more
                        },
                        {
                          case: { $eq: ['$$event.eventType', 'DEFAULT'] },
                          then: '$$event.eventData.totalViewCount',
                        },
                      ],
                      default: '$$event.eventData.totalViewCount',
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          categories: {
            $push: {
              typeName: '$type',
              eventData: '$events',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          categories: 1,
        },
      },
    ]).exec()

    return freelancerIntend[0]?.categories
  } catch (err: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot fetch top current tracking: ${err.message}`)
  }
}
