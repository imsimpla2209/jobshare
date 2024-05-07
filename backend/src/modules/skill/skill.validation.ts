import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewCreatedSkill } from './skill.interfaces'

const createSkillBody: Record<keyof NewCreatedSkill, any> = {
  name: Joi.string().required(),
  name_vi: Joi.string(),
  category: Joi.string(),
}

export const createSkill = {
  body: Joi.object().keys(createSkillBody),
}

export const getSkills = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getSkill = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateSkill = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      name_vi: Joi.string(),
      category: Joi.string(),
    })
    .min(1),
}

export const deleteSkill = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
