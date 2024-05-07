import Joi from 'joi'
import { EInvitationType, EStatus } from 'common/enums'
import { objectId } from '../../providers/validate/custom.validation'
import { NewCreatedNotify } from './notify.interfaces'

const createNotifyBody: Record<keyof NewCreatedNotify, any> = {
  to: Joi.string(),
  path: Joi.string(),
  attachedId: Joi.string(),
  content: Joi.any(),
  image: Joi.string(),
  seen: Joi.boolean(),
}

export const createInvitation = {
  body: Joi.object().keys({
    to: Joi.string(),
    from: Joi.string(),
    content: Joi.any(),
    type: Joi.string(),
    seen: Joi.boolean(),
    status: Joi.object().keys({
      status: Joi.string()
        .valid(...Object.values(EStatus))
        .required(),
      comment: Joi.string(),
    }),
    dueDate: Joi.number(),
    isDeleted: Joi.boolean(),
    background: Joi.string(),
    image: Joi.string(),
    attachments: Joi.array().items(Joi.string()),
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

export const createNotify = {
  body: Joi.object().keys(createNotifyBody),
}

export const getInvitations = {
  query: Joi.object().keys({
    to: Joi.string(),
    from: Joi.string(),
    type: Joi.string().valid(...Object.values(EInvitationType)),
    seen: Joi.boolean(),
    currentStatus: Joi.string().valid(...Object.values(EStatus)),
    content: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getNotifys = {
  query: Joi.object().keys({
    to: Joi.string(),
    seen: Joi.boolean(),
    content: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getNotify = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateNotify = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      path: Joi.string(),
      content: Joi.string(),
      image: Joi.string(),
      seen: Joi.boolean(),
    })
    .min(1),
}

export const updateManyNotify = {
  query: Joi.object().keys({
    to: Joi.string().required(),
    seen: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      path: Joi.string(),
      content: Joi.string(),
      image: Joi.string(),
      seen: Joi.boolean(),
    })
    .min(1),
}

export const deleteNotify = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
