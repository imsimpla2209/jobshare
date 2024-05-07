import { getClientByOptions } from '@modules/client/client.service'
import { getFreelancerByOptions } from '@modules/freelancer/freelancer.service'
import { EUserType } from 'common/enums'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions } from '../../providers/paginate/paginate'
import catchAsync from '../../utils/catchAsync'
import pick from '../../utils/pick'
import * as userService from './user.service'

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body)
  res.status(httpStatus.CREATED).send(user)
})

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role', 'isActive', 'balance', 'isVerified'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await userService.queryUsers(filter, options)
  res.send(result)
})

export const getOnlineUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getOnlineUsers()
  res.send(result)
})

export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.userId === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params.userId))
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    res.send(user)
  }
})

export const changeActiveUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.changeActiveUser(new mongoose.Types.ObjectId(req.params.userId))
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  res.send(user)
})

export const checkUserUniqueField = catchAsync(async (req: Request, res: Response) => {
  const uniqueField = pick(req.query, ['username', 'email', 'phone', 'nationalId'])
  const user = await userService.getUserByOptions(uniqueField)
  if (!user) {
    res.send(false)
  } else {
    res.send(true)
  }
})

export const verifyUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.userId === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params.userId))
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    res.send(user)
  }
})

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.userId === 'string') {
    const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params.userId), req.body)
    res.send(user)
  }
})

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.userId === 'string') {
    await userService.deleteUserById(new mongoose.Types.ObjectId(req.params.userId))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const switchToFreelancer = catchAsync(async (req: Request, res: Response) => {
  const freelancerProfile = await getFreelancerByOptions({ user: new mongoose.Types.ObjectId(req.user?._id) })
  userService.updateUserById(new mongoose.Types.ObjectId(req.user?._id), {
    lastLoginAs: EUserType.FREELANCER,
  })
  if (!freelancerProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not registered as a freelancer')
  }
  res.send(freelancerProfile)
})

export const switchToClient = catchAsync(async (req: Request, res: Response) => {
  const clientProfile = await getClientByOptions({ user: new mongoose.Types.ObjectId(req.user?._id) })
  userService.updateUserById(new mongoose.Types.ObjectId(req.user?._id), {
    lastLoginAs: EUserType.CLIENT,
  })
  if (!clientProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not registered as a client')
  }
  res.send(clientProfile)
})
