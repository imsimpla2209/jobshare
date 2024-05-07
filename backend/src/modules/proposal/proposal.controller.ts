import { getFreelancerByOptions } from '@modules/freelancer/freelancer.service'
import { createNotify } from '@modules/notify/notify.service'
import { EStatus } from 'common/enums'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { FEMessage, FERoutes } from 'common/enums/constant'
import ApiError from '../../common/errors/ApiError'
import { IOptions } from '../../providers/paginate/paginate'
import catchAsync from '../../utils/catchAsync'
import pick from '../../utils/pick'
import * as proposalService from './proposal.service'

export const createProposal = catchAsync(async (req: Request, res: Response) => {
  const proposal = await proposalService.createProposal(req.user._id, req.body)
  res.status(httpStatus.CREATED).send(proposal)
})

export const getProposals = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['job', '_id', 'status.status', 'freelancer', 'currentStatus'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await proposalService.queryProposals(filter, options)
  res.send(result)
})

export const getProposal = catchAsync(async (req: Request, res: Response) => {
  const proposal = await proposalService.getProposalById(new mongoose.Types.ObjectId(req.params.id))
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
  }
  res.send(proposal)
})

export const updateProposal = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const proposal = await proposalService.updateProposalById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(proposal)
  }
})

export const updateProposalStatus = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const proposal = await proposalService.updateProposalStatusById(
      new mongoose.Types.ObjectId(req.params.id),
      req.body?.status,
      req.body?.comment
    )

    if (req.body?.status === EStatus.INPROGRESS) {
      createNotify({
        to: proposal?.freelancer?.user,
        path: FERoutes.allProposals + (proposal?._id || ''),
        attachedId: proposal?._id,
        content: FEMessage(proposal?.job?.title).inProgressProposal,
      })
    } else if (req.body?.status === EStatus.REJECTED) {
      createNotify({
        to: proposal?.freelancer?.user,
        path: FERoutes.allProposals + (proposal?._id || ''),
        attachedId: proposal?._id,
        content: FEMessage(proposal?.job?.title).rejectProposal,
      })
    }

    res.send(proposal)
  }
})

export const withdrawProposal = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await getFreelancerByOptions({ user: req?.user?._id })
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }
    await proposalService.withdrawProposalById(new mongoose.Types.ObjectId(req.params.id), freelancer._id)
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const reSubmitProposal = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await getFreelancerByOptions({ user: req?.user?._id })
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }
    await proposalService.reSubmitProposal(new mongoose.Types.ObjectId(req.params.id), freelancer._id)
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const deleteProposal = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await proposalService.deleteProposalById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
