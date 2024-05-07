import { EStatus, EPriority } from 'common/enums'
import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewCreatedProposal } from './proposal.interfaces'

const createProposalBody: Record<keyof NewCreatedProposal, any> = {
  job: Joi.string().required(),
  freelancer: Joi.string().required(),
  expectedAmount: Joi.number().positive(),
  description: Joi.string().max(1969),
  attachments: Joi.array().items(Joi.string()),
  answers: Joi.object().pattern(Joi.number(), Joi.string()),
  priority: Joi.number().valid(...Object.values(EPriority)),
  sickUsed: Joi.number().positive(),
}

export const createProposal = {
  body: Joi.object().keys(createProposalBody),
}

export const getProposals = {
  query: Joi.object().keys({
    job: Joi.string(),
    _id: Joi.string(),
    freelancer: Joi.string(),
    'status.status': Joi.string().valid(...Object.values(EStatus)),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    currentStatus: Joi.string().valid(...Object.values(EStatus)),
  }),
}

export const getProposal = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateProposal = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      expectedAmount: Joi.number().positive(),
      description: Joi.string().max(1969),
      clientComment: Joi.string(),
      freelancerComment: Joi.string(),
      attachments: Joi.array().items(Joi.string()),
      answers: Joi.object().pattern(Joi.number(), Joi.string()),
    })
    .min(1),
}

export const updateProposalStatus = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid(...Object.values(EStatus)),
      comment: Joi.string().allow(null, ''),
    })
    .min(1),
}

export const deleteProposal = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const changeStatus = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
    status: Joi.string().valid(...Object.values(EStatus)),
  }),
}
