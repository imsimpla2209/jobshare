import { IPaymentInfo } from '@modules/payment/payment.interfaces'
import mongoose, { Document, Model } from 'mongoose'
import { ESex } from 'common/enums'
import { QueryResult } from '../../providers/paginate/paginate'
import { AccessAndRefreshTokens } from '../token/token.interfaces'

export interface IOAuth {
  google: any
  facebook: any
}

export interface IUser {
  name: string
  username: string
  email: string
  phone: string
  nationalId: string
  password: string
  role: string
  sex: ESex
  isEmailVerified: boolean
  isPhoneVerified: boolean
  oAuth?: IOAuth
  refreshToken?: string
  avatar?: string
  images?: string[]
  dob?: string
  address?: string
  paymentInfo?: IPaymentInfo
  isVerified?: boolean
  isActive?: boolean
  balance?: number
  lastLoginAs?: string
  jobsPoints?: number
  posts?: string[]
  comments?: string[]
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateUserBody = Partial<IUser>

export type NewRegisteredUser = Omit<
  IUser,
  | 'role'
  | 'isEmailVerified'
  | 'isPhoneVerified'
  | 'provider'
  | 'oAuth'
  | 'paymentInfo'
  | 'isVerified'
  | 'isActive'
  | 'balance'
  | 'refreshToken'
  | 'jobsPoints'
  | 'posts'
  | 'comments'
>

export type NewCreatedUser = Omit<
  IUser,
  | 'refreshToken'
  | 'paymentInfo'
  | 'isVerified'
  | 'isActive'
  | 'lastLoginAs'
  | 'balance'
  | 'jobsPoints'
  | 'posts'
  | 'comments'
>

export interface IUserWithTokens {
  user: IUserDoc
  tokens: AccessAndRefreshTokens
}
