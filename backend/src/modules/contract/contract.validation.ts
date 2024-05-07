import { EStatus } from 'common/enums'
import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewCreatedContract } from './contract.interfaces'

const createContractBody: Record<keyof NewCreatedContract, any> = {
  job: Joi.string().required(),
  proposal: Joi.string().required(),
  freelancer: Joi.string().required(),
  client: Joi.string().required(),
  overview: Joi.string().max(969),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  paymentType: Joi.string(),
  agreeAmount: Joi.number(),
  catalogs: Joi.array().items(Joi.string()),
  attachments: Joi.array().items(Joi.string()),
}

export const createContract = {
  body: Joi.object().keys({
    ...createContractBody,
    isAgree: Joi.boolean(),
  }),
}

export const getContracts = {
  query: Joi.object().keys({
    proposal: Joi.string(),
    freelancer: Joi.string(),
    client: Joi.string(),
    job: Joi.string(),
    currentStatus: Joi.string().valid(...Object.values(EStatus)),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getContract = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const acceptContract = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    invitationId: Joi.string(),
  }),
}

export const updateContract = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      attachments: Joi.array().items(Joi.string()),
      overview: Joi.string().max(969),
      catalogs: Joi.array().items(Joi.string()),
    })
    .min(1),
}

export const deleteContract = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateContractStatus = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string()
        .valid(...Object.values(EStatus))
        .required(),
      comment: Joi.string(),
    })
    .min(1),
}
