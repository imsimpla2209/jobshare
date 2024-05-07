import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import ApiError from '../../common/errors/ApiError'
import pick from '../../utils/pick'
import { IOptions } from '../../providers/paginate/paginate'
import * as skillService from './skill.service'

export const createSkill = catchAsync(async (req: Request, res: Response) => {
  const skill = await skillService.createSkill(req.body)
  res.status(httpStatus.CREATED).send(skill)
})

export const getSkills = catchAsync(async (req: Request, res: Response) => {
  // const filter = pick(req.query, ['name', 'role'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await skillService.querySkills(options)
  res.send(result)
})

export const getSkill = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const skill = await skillService.getSkillById(new mongoose.Types.ObjectId(req.params.id))
    if (!skill) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found')
    }
    res.send(skill)
  }
})

export const updateSkill = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const skill = await skillService.updateSkillById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(skill)
  }
})

export const deleteSkill = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await skillService.deleteSkillById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
