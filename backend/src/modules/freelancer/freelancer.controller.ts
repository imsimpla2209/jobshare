/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/naming-convention */
import { updateUserById } from '@modules/user/user.service'
import { EUserType } from 'common/enums'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions } from '../../providers/paginate/paginate'
import catchAsync from '../../utils/catchAsync'
import pick from '../../utils/pick'
import * as freelancerService from './freelancer.service'
import FreelancerTracking from './freelancer.tracking.model'
import { logger } from 'common/logger'

export const registerFreelancer = catchAsync(async (req: Request, res: Response) => {
  try {
    const { _id } = req.user
    const freelancer = await freelancerService.registerFreelancer(new mongoose.Types.ObjectId(_id), req.body)
    updateUserById(new mongoose.Types.ObjectId(req.user?._id), {
      lastLoginAs: EUserType.FREELANCER,
    })
    freelancerService.updateSimilarById(freelancer?._id)
    res.status(httpStatus.CREATED).send(freelancer)
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something Went Wrong ${err}`)
  }
})

export const getFreelancers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'skills', 'currentLocations', 'preferJobType'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await freelancerService.queryFreelancers(filter, options)
  res.send(result)
})

export const getAdvancedFreelancers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.body, [
    'id',
    'name',
    'intro',
    'currentLocations',
    'preferJobType',
    'skills',
    'jobsDone.number',
    'jobsDone.success',
    'earned',
    'rating',
    'available',
    'expectedAmount',
    'expectedPaymentType',
  ])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await freelancerService.queryAdvancedFreelancers(filter, options)
  res.send(result)
})

export const searchFreelancers = catchAsync(async (req: Request, res: Response) => {
  const { searchText } = req.body
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await freelancerService.searchFreelancersByText(searchText, options)
  res.send(result)
})

export const getRcmdFreelancers = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await freelancerService.getRcmdFreelancers(new mongoose.Types.ObjectId(req.params.jobId), options)
  res.send(result)
})

export const getFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await freelancerService.getFreelancerById(new mongoose.Types.ObjectId(req.params.id))
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }
    res.send(freelancer)
  }
})

export const getFreelancerByIdWithPopulate = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await freelancerService.getFreelancerByIdWithPopulate(new mongoose.Types.ObjectId(req.params.id))
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }
    res.send(freelancer)
  }
})

export const verifyFreelancerById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await freelancerService.verifyFreelancerById(new mongoose.Types.ObjectId(req.params.id))
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }
    res.send(freelancer)
  }
})

export const getFreelancerByOption = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions(req.body)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  res.send(freelancer)
})

export const updateFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await freelancerService.updateFreelancerById(
      new mongoose.Types.ObjectId(req.params.id),
      req.body
    )
    freelancerService.updateSimilarById(freelancer?._id)
    res.send(freelancer)
  }
})

export const updateSimilarById = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  const newSimilarDoc = await freelancerService.updateSimilarById(freelancer?._id)
  res.send(newSimilarDoc)
})

export const createProfile = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  const updatedFreelancer = await freelancerService.createFreelancerProfileById(
    new mongoose.Types.ObjectId(freelancer?._id),
    req.body
  )
  freelancerService.updateSimilarById(updatedFreelancer?._id)
  res.send(updatedFreelancer)
})

export const forceDeleteFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await freelancerService.deleteFreelancerById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const deleteFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await freelancerService.softDeleteFreelancerById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const reviewFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await freelancerService.reviewFreelancerById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const getFreelancerTracking = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const freelancerTracking = await FreelancerTracking.findOne({ freelancer: freelancer?._id?.toString() })
  if (!freelancerTracking) {
    const newFreelancerTracking = await FreelancerTracking.create({
      freelancer: freelancer?._id?.toString(),
    })
    res.send({ freelancerTracking: newFreelancerTracking, isFirstTime: true })
  }
  res.send({ freelancerTracking, isFirstTime: false })
})

export const updateFreelancerTracking = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const updatedFreelancerTracking = await FreelancerTracking.updateOne(
    { freelancer: freelancer?._id?.toString() },
    req.body
  )
  res.send(updatedFreelancerTracking)
})

export const deleteFreelancerTracking = catchAsync(async (req: Request, res: Response) => {
  const updatedFreelancerTracking = await FreelancerTracking.deleteOne({ freelancer: req.params.id?.toString() })
  res.send(updatedFreelancerTracking)
})

export const deleteAllFreelancerTracking = catchAsync(async (req: Request, res: Response) => {
  await FreelancerTracking.deleteMany()
  res.send(true)
})

export const createFreelancerTracking = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  logger.info('freelancer tracking body', req.body)
  const updatedFreelancer = await freelancerService.createFreelancerProfileById(
    new mongoose.Types.ObjectId(freelancer?._id),
    req.body
  )
  freelancerService.updateSimilarById(updatedFreelancer?._id)
  res.send(updatedFreelancer)
})

export const getTopCurrentTypeTracking = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  const topTypes = await freelancerService.getTopCurrentTypeTracking(freelancer)
  res.send(topTypes)
})

export const getLastestTopJobs = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  const lastestTopJobs = await freelancerService.getLastestTopJobs(freelancer)
  res.send(lastestTopJobs)
})

export const getTopTrackingPoints = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  const lastestTopJobs = await freelancerService.getTopTrackingPoint(freelancer)
  res.send(lastestTopJobs)
})

export const getLastestTopType = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  const lastestTopJobs = await freelancerService.getLastestTopCurrentTypeTracking(freelancer)
  res.send(lastestTopJobs)
})

export const getFreelancerIntend = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  const freelancerIntend = await freelancerService.getFreelancerIntend(freelancer)
  res.send(freelancerIntend)
})
