/* eslint-disable @typescript-eslint/naming-convention */
import { updateUserById } from '@modules/user/user.service'
import { EUserType } from 'common/enums'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions } from '../../providers/paginate/paginate'
import catchAsync from '../../utils/catchAsync'
import pick from '../../utils/pick'
import * as clientService from './client.service'
import { Freelancer } from '@modules/freelancer'

export const registerClient = catchAsync(async (req: Request, res: Response) => {
  const user = await clientService.registerClient(new mongoose.Types.ObjectId(req.body?.user), req.body)
  updateUserById(new mongoose.Types.ObjectId(req.body?.user), {
    lastLoginAs: EUserType.CLIENT,
  })
  res.status(httpStatus.CREATED).send(user)
})

export const getClients = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'rating'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await clientService.queryClients(filter, options)
  res.send(result)
})

export const getClient = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const user = await clientService.getClientById(new mongoose.Types.ObjectId(req.params.id))
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
    }
    res.send(user)
  }
})

export const verifyClientById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const user = await clientService.verifyClientById(new mongoose.Types.ObjectId(req.params.id))
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
    }
    res.send(user)
  }
})

export const getClientByOption = catchAsync(async (req: Request, res: Response) => {
  const user = await clientService.getClientById(new mongoose.Types.ObjectId(req.params.id))
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  res.send(user)
})

export const updateClient = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const user = await clientService.updateClientById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(user)
  }
})

export const forcedDeleteClient = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await clientService.deleteClientById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const deleteClient = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await clientService.softDeleteClientById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const reviewClient = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await clientService.reviewClientById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const getTopClients = (req: Request, res: Response) => {
  
}

export const getCurrentRelateClientsForFreelancer = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await Freelancer.findOne({ user: new mongoose.Types.ObjectId(req?.user?._id as string) }).lean()
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const result = await clientService.getCurrentRelateClientsForFreelancer(freelancer, options)
  res.send(result)
})
