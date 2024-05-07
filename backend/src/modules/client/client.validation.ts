import { reviewBody } from 'common/interfaces/subInterfaces'
import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewRegisteredClient } from './client.interfaces'

const createClientBody: Record<keyof NewRegisteredClient, any> = {
  user: Joi.string().required(),
  intro: Joi.string(),
  name: Joi.string().required(),
  organization: Joi.string(),
  preferencesURL: Joi.array().items(Joi.string()),
  preferLocations: Joi.array().items(Joi.string()),
  preferJobType: Joi.array().items(Joi.string()),
  favoriteFreelancers: Joi.array().items(Joi.string()),
  findingSkills: Joi.array().items(Joi.string().custom(objectId)),
}

export const createClient = {
  body: Joi.object().keys(createClientBody),
}

export const getClients = {
  query: Joi.object().keys({
    name: Joi.string(),
    rating: Joi.object().keys({ from: Joi.number(), to: Joi.number() }),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getClient = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateClient = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      intro: Joi.string(),
      name: Joi.string(),
      organization: Joi.string(),
      preferencesURL: Joi.array().items(Joi.string()),
      preferLocations: Joi.array().items(Joi.string()),
      preferJobType: Joi.array().items(Joi.string()),
      favoriteFreelancers: Joi.array().items(Joi.string()),
    })
    .min(1),
}

export const deleteClient = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const reviewClient = {
  body: Joi.object().keys(reviewBody),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
