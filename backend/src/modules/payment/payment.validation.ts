import { EPaymentMethod, EPaymentPurpose } from 'common/enums'
import Joi from 'joi'
import { objectId, password } from '../../providers/validate/custom.validation'
import { NewCreatedPayment } from './payment.interfaces'

const createPaymentBody: Record<keyof NewCreatedPayment, any> = {
  purpose: Joi.string().valid(...Object.values(EPaymentPurpose)),
  from: Joi.string(),
  to: Joi.string(),
  isToAdmin: Joi.boolean(),
  note: Joi.string(),
  amount: Joi.number().required().positive(),
  paymentMethod: Joi.string().valid(...Object.values(EPaymentMethod)),
}

export const createPayment = {
  body: Joi.object().keys(createPaymentBody),
}

export const buyJobsPoints = {
  body: Joi.object().keys({
    jobsPoints: Joi.number().required().positive(),
    buyer: Joi.string(),
    ...createPaymentBody,
  }),
}

export const getPayments = {
  query: Joi.object().keys({
    from: Joi.string(),
    purpose: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getPayment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updatePayment = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
}

export const deletePayment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
