import jwt from 'jsonwebtoken'
import moment, { Moment } from 'moment'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import { randomInt } from 'node:crypto'
import config from '../../config/config'
import Token from './token.model'
import ApiError from '../../common/errors/ApiError'
import tokenTypes from './token.types'
import { AccessAndRefreshTokens, ITokenDoc } from './token.interfaces'
import { IUserDoc } from '../user/user.interfaces'
import { userService } from '../user'

/**
 * Generate token
 * @param {mongoose.Types.ObjectId} id
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  id: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: id,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  }
  return jwt.sign(payload, secret)
}

/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} id
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
export const saveToken = async (
  token: string,
  id: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  blacklisted: boolean = false
): Promise<ITokenDoc> => {
  const tokenDoc = await Token.create({
    token,
    user: id,
    expires: expires.toDate(),
    type,
    blacklisted,
  })
  return tokenDoc
}

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const verifyToken = async (token: string, type: string): Promise<ITokenDoc> => {
  const payload = jwt.verify(token, config.jwt.secret)
  if (typeof payload.sub !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad user')
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  })
  if (!tokenDoc) {
    throw new Error('Token not found')
  }
  return tokenDoc
}

/**
 * Generate auth tokens
 * @param {IUserDoc} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
export const generateAuthTokens = async (user: IUserDoc): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS)

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days')
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH)
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH)
  const cookiConfigs = config.jwt.cookieOptions

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
    cookie: `Authentication=${accessToken}; HttpOnly=${cookiConfigs.httpOnly}; secure=${cookiConfigs.secure} Path=/; signed=${cookiConfigs.signed} Max-Age=${cookiConfigs.maxAge}`,
  }
}

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email)
  if (!user) {
    throw new ApiError(httpStatus.NO_CONTENT, '')
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes')
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD)
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD)
  return resetPasswordToken
}

/**
 * Generate sms token
 * @param {string} userId
 * @returns {Promise<string>}
 */
export const generateSMSToken = async (userId: mongoose.Types.ObjectId): Promise<any> => {
  const user = await userService.getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'not found this user')
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes')
  const otpCode = randomInt(1000_000).toString().padStart(6, '0')

  const smsToken = saveToken(otpCode, user?._id, expires, tokenTypes.SMS)
  return smsToken
}

export const verifySMSToken = async (token: string, userId: mongoose.Types.ObjectId): Promise<ITokenDoc> => {
  const tokenDoc = await Token.findOne({
    token,
    type: tokenTypes.SMS,
    user: userId,
    blacklisted: false,
  })
  if (!tokenDoc) {
    throw new Error('Token not found')
  }
  return tokenDoc
}

/**
 * Generate verify email token
 * @param {IUserDoc} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user: IUserDoc): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes')
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL)
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL)
  return verifyEmailToken
}

/**
 * get token
 * @param {IUserDoc} options
 * @returns {Promise<any>}
 */
export const getRefreshToken = async (user: any): Promise<any> => {
  const token = Token.findOne({ user, type: tokenTypes.REFRESH })
  return token
}
