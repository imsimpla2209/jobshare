import { IUserDoc } from '@modules/user/user.interfaces'
import Joi from 'joi'

export interface IReview {
  creator: IUserDoc['_id']
  content?: string
  rating?: number
  isAnonymous?: boolean
}

export const reviewBody: Record<keyof IReview, any> = {
  creator: Joi.string().required(),
  content: Joi.string().required(),
  rating: Joi.number().positive().max(5),
  isAnonymous: Joi.boolean(),
}

export interface IWorkScope {
  workType: IUserDoc['_id']
  locations?: string[]
  jobCategories?: number
  isAnonymous?: boolean
  target?: string
}
