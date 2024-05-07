import { EMessagePurpose, EMessageType, EStatus } from 'common/enums'
import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewCreatedMessage } from './message.interfaces'

const createMessageBody: Record<keyof NewCreatedMessage, any> = {
  room: Joi.string().required(),
  from: Joi.string().required(),
  to: Joi.string().required(),
  content: Joi.string().max(969).required(),
  attachments: Joi.array().items(Joi.string()),
  seen: Joi.boolean(),
  type: Joi.string().valid(...Object.values(EMessageType)),
  other: Joi.string(),
}

export const createMessageRoom = {
  body: Joi.object().keys({
    member: Joi.array().items(Joi.string()),
    proposalStatusCatalog: Joi.array().items(Joi.string()),
    proposal: Joi.string(),
    background: Joi.string(),
    image: Joi.string(),
    purpose: Joi.string().valid(...Object.values(EMessagePurpose)),
    type: Joi.string().valid(...Object.values(EMessagePurpose)),
    attachments: Joi.array().items(Joi.string()),
  }),
}

export const requestMessageRoom = {
  body: Joi.object().keys({
    from: Joi.string().required(),
    to: Joi.string().required(),
    proposal: Joi.string(),
    text: Joi.string(),
  }),
}

export const createMessage = {
  body: Joi.object().keys(createMessageBody),
}

export const getMessageRooms = {
  query: Joi.object().keys({
    proposal: Joi.string(),
    member: Joi.array().items(Joi.string()),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const updateStatus = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid(...Object.values(EStatus)),
    })
    .min(1),
}

export const getMessages = {
  query: Joi.object().keys({
    room: Joi.string(),
    from: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getMessage = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateMessage = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      content: Joi.string().max(969).required(),
      attachments: Joi.array().items(Joi.string()),
    })
    .min(1),
}

export const updateMessageRoom = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      member: Joi.array().items(Joi.string()),
      proposalStatusCatalog: Joi.array().items(Joi.string()),
      proposal: Joi.string(),
      background: Joi.string(),
      image: Joi.string(),
      attachments: Joi.array().items(Joi.string()),
      seen: Joi.boolean(),
      purpose: Joi.string().valid(...Object.values(EMessagePurpose)),
    })
    .min(1),
}

export const deleteMessage = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
