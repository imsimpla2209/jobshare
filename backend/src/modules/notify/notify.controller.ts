import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import ApiError from '../../common/errors/ApiError'
import pick from '../../utils/pick'
import { IOptions } from '../../providers/paginate/paginate'
import * as notifyService from './notify.service'

export const createNotify = catchAsync(async (req: Request, res: Response) => {
  const msg = {
    name: req.body.content,
    name_vi: req.body.content,
  }
  const notify = await notifyService.createNotify({
    ...req.body,
    content: msg,
  })
  res.status(httpStatus.CREATED).send(notify)
})

export const getNotifys = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['to', 'seen'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await notifyService.queryNotifys(filter, options)
  res.send(result)
})

export const getNotify = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const notify = await notifyService.getNotifyById(new mongoose.Types.ObjectId(req.params.id))
    if (!notify) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notify not found')
    }
    res.send(notify)
  }
})

export const updateNotify = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const notify = await notifyService.updateNotifyById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(notify)
  }
})

export const updateManyNotify = catchAsync(async (req: Request, res: Response) => {
  const notify = await notifyService.updateManyNotifyByOptions(pick(req.query, ['to', 'seen']), req.body)
  res.send(notify)
})

export const deleteNotify = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await notifyService.deleteNotifyById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

// Invitation Controllers ----------------------------------------------------------------
export const createInvitation = catchAsync(async (req: Request, res: Response) => {
  const notify = await notifyService.createInvitation(req.body)
  res.status(httpStatus.CREATED).send(notify)
})

export const getInvitations = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['to', 'from', 'seen', 'type', 'currentStatus'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await notifyService.queryInvitations(filter, options)
  res.send(result)
})

export const getInvitation = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const notify = await notifyService.getInvitationById(new mongoose.Types.ObjectId(req.params.id))
    if (!notify) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found')
    }
    res.send(notify)
  }
})

export const updateInvitationStatus = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const invitation = await notifyService.updateInvitationStatusById(
      new mongoose.Types.ObjectId(req.params.id),
      req.body?.status
    )
    res.send(invitation)
  }
})

export const updateInvitation = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const notify = await notifyService.updateInvitationById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(notify)
  }
})

export const updateManyInvitation = catchAsync(async (req: Request, res: Response) => {
  const notify = await notifyService.updateManyInvitationByOptions(pick(req.query, ['to', 'seen']), req.body)
  res.send(notify)
})

export const deleteInvitation = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await notifyService.deleteNotifyById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
