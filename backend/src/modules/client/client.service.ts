/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import queryGen from '@core/libs/queryGennerator'
import { createNotify } from '@modules/notify/notify.service'
import { FEMessage } from 'common/enums/constant'
import { IReview } from 'common/interfaces/subInterfaces'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IClientDoc, NewRegisteredClient, UpdateClientBody } from './client.interfaces'
import Client from './client.model'
import { IFreelancerDoc } from '@modules/freelancer/freelancer.interfaces'
import { getSimilarByFreelancerId, getTopTrackingPoint } from '@modules/freelancer/freelancer.service'
import { redisInsance } from '@core/databases/Redis'
import logger from 'common/logger/logger'

/**
 * Register a client
 * @param {NewRegisteredClient} clientBody
 * @returns {Promise<IClientDoc>}
 */
export const registerClient = async (
  userId: mongoose.Types.ObjectId,
  clientBody: NewRegisteredClient
): Promise<IClientDoc> => {
  // const user = await getUserById(userId)
  // if (!user.isVerified) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, `User is not verified`)
  // }
  if (await Client.isUserSigned(clientBody.user)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Client')
  }
  return Client.create(clientBody)
}

/**
 * Query for clients
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryClients = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  filter['name'] && (filter['name'] = { $search: `${filter['name']}`, $diacriticSensitive: true })
  filter['intro'] = { $regex: `${filter['name']}`, $options: 'i' }

  filter['rating'] && (filter['rating'] = queryGen.numRanges(filter['rating']?.from, filter['rating']?.to))
  const clients = await Client.paginate(filter, options)
  return clients
}

/**
 * Get client by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IClientDoc | null>}
 */
export const getClientById = async (id: mongoose.Types.ObjectId): Promise<IClientDoc | null> =>
  Client.findById(id).populate(['user', 'preferJobType'])

/**
 * Get client by clientname
 * @param {string} clientname
 * @returns {Promise<IClientDoc | null>}
 */
export const getClientByClientname = async (clientname: string): Promise<IClientDoc | null> =>
  Client.findOne({ clientname })

/**
 * Get client by email
 * @param {string} email
 * @returns {Promise<IClientDoc | null>}
 */
export const getClientByEmail = async (email: string): Promise<IClientDoc | null> => Client.findOne({ email })

/**
 * Get client by option
 * @param {object} options
 * @returns {Promise<IClientDoc | null>}
 */
export const getClientByOptions = async (Options: any): Promise<IClientDoc | null> => Client.findOne(Options)

/**
 * Update client by id
 * @param {mongoose.Types.ObjectId} clientId
 * @param {UpdateClientBody} updateBody
 * @returns {Promise<IClientDoc | null>}
 */
export const updateClientById = async (
  clientId: mongoose.Types.ObjectId,
  updateBody: UpdateClientBody
): Promise<IClientDoc | null> => {
  const client = await getClientById(clientId)
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  Object.assign(client, updateBody)
  await client.save()
  return client
}

/**
 * Verify client by id
 * @param {mongoose.Types.ObjectId} clientId
 * @param {UpdateClientBody} updateBody
 * @returns {Promise<IClientDoc | null>}
 */
export const verifyClientById = async (clientId: mongoose.Types.ObjectId): Promise<IClientDoc | null> => {
  const client = await Client.findById(clientId)
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  Object.assign(client, {
    paymentVerified: true,
  })
  createNotify({
    to: client?.user,
    path: `/`,
    content: FEMessage().profileVerified,
  })
  await client.save()
  return client
}

/**
 * Delete client by id
 * @param {mongoose.Types.ObjectId} clientId
 * @returns {Promise<IClientDoc | null>}
 */
export const deleteClientById = async (clientId: mongoose.Types.ObjectId): Promise<IClientDoc | null> => {
  const client = await getClientById(clientId)
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  await client.deleteOne()
  return client
}

/**
 * Soft Delete client by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IClientDoc | null>}
 */
export const softDeleteClientById = async (freelancerId: mongoose.Types.ObjectId): Promise<IClientDoc | null> => {
  const freelancer = await Client.findByIdAndUpdate(freelancerId, { isDeleted: true })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  return freelancer
}

/**
 * review client by id
 * @param {mongoose.Types.ObjectId} clientId
 * @param {IReview} review
 * @returns {Promise<IClientDoc | null>}
 */
export const reviewClientById = async (
  clientId: mongoose.Types.ObjectId,
  review: IReview
): Promise<IClientDoc | null> => {
  const client = await getClientById(clientId)
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  client['reviews'] = [...client?.reviews, review]
  await client.save()
  return client
}

export const getCurrentRelateClientsForFreelancer = async (
  freelancer: IFreelancerDoc,
  options?: IOptions,
  inputType?: any
): Promise<any | null> => {
  try {
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }

    const cacheKey = `similarClient:${freelancer?._id?.toString()}`

    const cachedData = await redisInsance.getValue(cacheKey)
    if (cachedData) {
      logger.info(`get similar Clients from cache for freelancerId: ${cacheKey}`)
      return JSON.parse(cachedData)
    }

    const type = inputType || (await getTopTrackingPoint(freelancer))

    const similarDocs = await getSimilarByFreelancerId(freelancer?._id || freelancer.id)

    const matchingClient = await Client.aggregate([
      // {
      //   $match: {
      //     is: 'open',
      //   },
      // },
      {
        $addFields: {
          totalMatchingPoints: {
            $sum: [
              {
                $reduce: {
                  input: '$findingSkills',
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
                                    input: type?.skillRankings?.map(s => ({
                                      skill: new mongoose.Types.ObjectId(s?.skill),
                                      totalPoints: s?.totalPoints,
                                    })),
                                    as: 'sr',
                                    cond: { $eq: ['$$sr.skill', '$$this'] },
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
                  input: '$preferJobType',
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
                                    input: type?.categoryRankings?.map(s => ({
                                      skill: new mongoose.Types.ObjectId(s?.category),
                                      totalPoints: s?.totalPoints,
                                    })),
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
              // {
              //   $cond: [{ $regexMatch: { input: '$title', regex: similarDocs?.similarKeys } }, 1, 0],
              // },
              {
                $cond: [{ $regexMatch: { input: '$intro', regex: similarDocs?.similarKeys } }, 1, 0],
              },
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [
                        similarDocs?.potentialJobCats?.map(c => new mongoose.Types.ObjectId(c)) || [],
                        { $ifNull: ['$preferJobType', []] },
                      ],
                    },
                  },
                  2.7,
                ],
              },
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [
                        similarDocs?.potentialSkills?.map(c => new mongoose.Types.ObjectId(c)) || [],
                        { $ifNull: ['$findingSkills', []] },
                      ],
                    },
                  },
                  2.9,
                ],
              },
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [
                        similarDocs?.similarJobCats?.map(c => new mongoose.Types.ObjectId(c)) || [],
                        { $ifNull: ['$preferJobType', []] },
                      ],
                    },
                  },
                  2,
                ],
              },
              {
                $multiply: [
                  {
                    $cond: [
                      { $in: ['$_id', similarDocs?.similarClients.map(c => new mongoose.Types.ObjectId(c))] },
                      3.6,
                      0,
                    ],
                  },
                  2.5
                ],
              },
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [
                        similarDocs?.similarSkills?.map(c => new mongoose.Types.ObjectId(c)) || [],
                        { $ifNull: ['$findingSkills', []] },
                      ],
                    },
                  },
                  2,
                ],
              },
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [similarDocs.similarLocations || [], { $ifNull: ['$preferLocations', []] }],
                    },
                  },
                  1.4,
                ],
              },
              // { $cond: [{ $in: ['$scope.complexity', complexities] }, 1, 0] },
              // { $cond: [{ $in: ['$scope.duration', durations] }, 1, 0] },
              // { $cond: [{ $in: ['$preferences.nOEmployee', nOEmployees] }, 1, 0] },
              // {
              //   $cond: [
              //     {
              //       $and: [
              //         { $gte: ['$budget', (budget || 0) - (budget || 0) / 4.3] },
              //         { $lte: ['$budget', (budget || 0) + (budget || 0) / 4.3] },
              //       ],
              //     },
              //     1,
              //     0,
              //   ],
              // },
              // {
              //   $sum: {
              //     $map: {
              //       input: payments,
              //       as: 'payment',
              //       in: {
              //         $cond: [
              //           {
              //             $and: [
              //               { $eq: ['$payment.type', '$$payment.type'] },
              //               {
              //                 $and: [
              //                   {
              //                     $gte: [
              //                       '$payment.amount',
              //                       { $subtract: ['$$payment.amount', { $divide: ['$$payment.amount', 4.3] }] },
              //                     ],
              //                   },
              //                   {
              //                     $lte: [
              //                       '$payment.amount',
              //                       { $add: ['$$payment.amount', { $divide: ['$$payment.amount', 4.3] }] },
              //                     ],
              //                   },
              //                 ],
              //               },
              //             ],
              //           },
              //           1,
              //           0,
              //         ],
              //       },
              //     },
              //   },
              // },
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

    const fullyClientsData = await Client.populate(matchingClient, [{ path: 'findingSkills'}, { path: 'preferJobType'}, { path: 'user'}])

    return fullyClientsData
  } catch (error: any) {
    logger.error(`Error finding related clients:${error}`)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error finding related jobs: ${error}`)
  }
}
