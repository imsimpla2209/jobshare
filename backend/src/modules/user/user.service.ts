/* eslint-disable no-param-reassign */
import Bcrypt from '@core/libs/Bcrypt'
import { io } from '@core/libs/SocketIO'
import { ESocketEvent } from 'common/enums'
import { logger } from 'common/logger'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IUserDoc, NewCreatedUser, NewRegisteredUser, UpdateUserBody } from './user.interfaces'
import User from './user.model'

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }
  return User.create(userBody)
}

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }
  return User.create(userBody)
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options)
  return users
}

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id)

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByUsername = async (username: string): Promise<IUserDoc | null> => User.findOne({ username })

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> => User.findOne({ email })

/**
 * Get user by option
 * @param {object} options
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByOptions = async (Options: any): Promise<IUserDoc | null> => User.findOne(Options)

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }
  if (!updateBody.avatar) {
    delete updateBody.avatar
  }

  Object.assign(user, updateBody)
  await user.save()
  return user
}

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  await user.deleteOne()
  return user
}

/**
 * set user refreshToken user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<void>}
 */
export const setUserRefreshToken = async (userId: mongoose.Types.ObjectId, token: string): Promise<void> => {
  try {
    const hashedRefreshToken = await Bcrypt.encrypt(token)
    await User.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    })
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong: ${error.message}`)
  }
}

/**
 * get user refreshToken user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<void>}
 */
export const getUserWithRefreshtoken = async (
  userId: mongoose.Types.ObjectId,
  token: string
): Promise<IUserDoc | null> => {
  try {
    const user = await User.findById(userId).select('+refreshToken')
    const checkRefreshToken = Bcrypt.compare(token, user?.refreshToken)
    if (!checkRefreshToken) {
      throw new Error(`Refresh token doesn't match`)
    }
    delete user.password
    return user
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong: ${error.message}`)
  }
}

/**
 * remove user refreshToken user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<void>}
 */
export const removeRefreshToken = async (userId: mongoose.Types.ObjectId): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
    })
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong: ${error.message}`)
  }
}

/**
 * deactive user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<void>}
 */
export const changeActiveUser = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    const futureActive = !user?.isActive
    Object.assign(user, {
      isActive: futureActive,
    })
    if (!futureActive) {
      const onlineUser = await io.getOnlineUserWithSocket(user?._id?.toString() || user?.id?.toString())
      if (onlineUser) {
        logger.info(`Deactive user: ${user?._id || user?.id}`)
        io.sendToId(onlineUser.socketId, ESocketEvent.DEACTIVE, {
          userId: user?._id || user?.id,
          type: ESocketEvent.DEACTIVE,
        })
      }
      // const onlineUsers = await io.getAllOnlineUsers()
      // if (onlineUsers[user?._id || user?.id]) {
      //   logger.info(`Deactive user: ${user?._id || user?.id}`)
      //   onlineUsers[user?._id || user?.id].socket.emit(ESocketEvent.DEACTIVE, {
      //     userId: user?._id || user?.id,
      //     type: ESocketEvent.DEACTIVE,
      //   })
      // }
    }
    await user.save()
    return user
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong: ${error.message}`)
  }
}

export const getOnlineUsers = async () => {
  const onlineUsers = await io.getAllOnlineUsers()
  return onlineUsers || {}
}

/**
 * add jobsPoints for user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {number} points
 * @returns {Promise<void>}
 */
export const addPointForUser = async (userId: mongoose.Types.ObjectId, points: number): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, {
      jobsPoints: points,
    })
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong: ${error.message}`)
  }
}

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {number} amount
 * @param {boolean} isUsed
 * @returns {Promise<IUserDoc | null>}
 */
export const updateJobsPointsById = async (
  userId: mongoose.Types.ObjectId,
  amount: number,
  isUsed: boolean
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  const changedAmount = isUsed ? -amount : amount
  Object.assign(user, { jobsPoints: user.jobsPoints + changedAmount })
  await user.save()
  return user
}
