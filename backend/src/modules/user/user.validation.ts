import { ESex, EUserType } from 'common/enums'
import Joi from 'joi'
import { objectId, password } from '../../providers/validate/custom.validation'
import { NewCreatedUser } from './user.interfaces'

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().required().email(),
  phone: Joi.string(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  role: Joi.string().valid('user', 'admin'),
  username: Joi.string().required(),
  isEmailVerified: Joi.boolean(),
  oAuth: Joi.any(),
  avatar: Joi.string(),
  images: Joi.array().items(Joi.string()),
  dob: Joi.string(),
  address: Joi.string(),
  nationalId: Joi.string(),
  isPhoneVerified: Joi.boolean(),
  sex: Joi.number().valid(...Object.values(ESex)),
}

export const createUser = {
  body: Joi.object().keys({ ...createUserBody, lastLoginAs: Joi.string() }),
}

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    isActive: Joi.boolean(),
    isVerified: Joi.boolean(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
}

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      avatar: Joi.string().allow('', null),
      images: Joi.array().items(Joi.string()),
      dob: Joi.string(),
      address: Joi.string(),
      nationalId: Joi.string(),
      phone: Joi.string(),
      sex: Joi.number().valid(...Object.values(ESex)),
      lastLoginAs: Joi.string().valid(...Object.values(EUserType)),
    })
    .min(1),
}

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
}
