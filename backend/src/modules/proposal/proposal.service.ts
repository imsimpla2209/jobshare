/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/dot-notation */
import { deleteContractByOptions } from '@modules/contract/contract.service'
import { addProposaltoFreelancerById, getFreelancerByOptions } from '@modules/freelancer/freelancer.service'
import { Job } from '@modules/job'
import { addApplytoJobById, addProposaltoJobById, isJobOpened } from '@modules/job/job.service'
import { Message } from '@modules/message'
import { createNotify, deleteNotifyByOption } from '@modules/notify/notify.service'
import { updateJobsPointsById } from '@modules/user/user.service'
import { EPriority, EStatus } from 'common/enums'
import { FEMessage, FERoutes } from 'common/enums/constant'
import { logger } from 'common/logger'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
// import App from '@modules/admin/models/app.model'
import { sendCreatedNotifyProposal } from '@modules/forum/utils/mailer'
import { getAppInfo } from '@modules/admin/controllers/dashboard.controller'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IProposalDoc, NewCreatedProposal, UpdateProposalBody } from './proposal.interfaces'
import Proposal from './proposal.model'

/**
 * Register a proposal
 * @param {NewCreatedProposal} proposalBody
 * @param {ObjectId} userId
 * @returns {Promise<IProposalDoc>}
 */
export const createProposal = async (
  userId: mongoose.Types.ObjectId,
  proposalBody: NewCreatedProposal
): Promise<IProposalDoc> => {
  const isJobOpen = await isJobOpened(proposalBody.job, proposalBody as IProposalDoc)
  if (!isJobOpen) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Either you or your proposal is incompatible with job!')
  }
  let newProposal: any
  try {
    const appInfo = await getAppInfo()
    updateJobsPointsById(userId, appInfo?.freelancerSicks?.proposalCost + (proposalBody?.priority || 0) * 2, true)

    proposalBody['status'] = [
      {
        date: new Date(),
        status: EStatus.PENDING,
        comment: 'Created from freelancer',
      },
    ]

    proposalBody['sickUsed'] = appInfo?.freelancerSicks?.proposalCost + (proposalBody?.priority || 0) * 2

    proposalBody['currentStatus'] = EStatus.PENDING

    newProposal = await Proposal.create(proposalBody)
    const jobInfo = await addProposaltoJobById(proposalBody.job, newProposal._id)
    const freelancer = await addProposaltoFreelancerById(proposalBody.freelancer, newProposal._id)
    const job = await addApplytoJobById(proposalBody.job, proposalBody.freelancer)

    createNotify({
      to: jobInfo?.client?.user,
      path: FERoutes.jobDetail + (jobInfo?._id || ''),
      attachedId: newProposal?._id,
      content: FEMessage(jobInfo?.title).createProposal,
    })

    if (proposalBody?.priority > EPriority.MEDIUM) {
      sendCreatedNotifyProposal(
        job?.client?.user?.email,
        job?.client?.user?.name,
        FERoutes.jobDetail + (jobInfo?._id || ''),
        freelancer?.user?.name,
        job?.title,
        proposalBody
      )
    }

    return newProposal
  } catch (err: any) {
    Proposal.findByIdAndDelete(newProposal?._id)
    logger.error('cannot create proposal', err)
    throw new ApiError(httpStatus.BAD_REQUEST, 'cannot create proposals')
  }
}

/**
 * Query for proposals
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProposals = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const freelancerFilter = filter['freelancer'] ? { freelancer: filter['freelancer'] || '' } : {}
  const jobFilter = filter['job'] ? { job: filter['job'] || '' } : {}
  const statusFilter = filter['currentStatus'] ? { currentStatus: filter['currentStatus'] || '' } : {}

  const queryFilter = {
    $and: [freelancerFilter, jobFilter, statusFilter],
  }

  if (!options.projectBy) {
    options.projectBy =
      'job, freelancer, expectedAmount, description, status, clientComment, freelancerComment, createdAt, updatedAt, attachments, contract, messages, answers, priority, currentStatus,  msgRequestSent '
  }
  options.populate = 'job.client'

  if (!options.sortBy) {
    options.sortBy = 'updatedAt:desc,priority:desc'
  }
  const proposals = await Proposal.paginate(queryFilter, options)
  return proposals
}

/**
 * Get proposal by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProposalDoc | null>}
 */
export const getProposalById = async (id: mongoose.Types.ObjectId): Promise<IProposalDoc | null> =>
  Proposal.findById(id)
    .select(
      'createdAt job freelancer expectedAmount description clientComment freelancerComment attachments messages currentStatus status updatedAt'
    )
    .populate('job')
    .populate('freelancer')

/**
 * Get proposals by Job id
 * @param {mongoose.Types.ObjectId} job
 * @returns {Promise<IProposalDoc | null>}
 */
export const getProposalByJobId = async (job: mongoose.Types.ObjectId): Promise<IProposalDoc[] | null> =>
  Proposal.find({ job })

/**
 * Get proposal by option
 * @param {object} Options
 * @returns {Promise<IProposalDoc | null>}
 */
export const getProposalByOptions = async (Options: any): Promise<IProposalDoc | null> => Proposal.findOne(Options)

/**
 * Update proposal by id
 * @param {mongoose.Types.ObjectId} proposalId
 * @param {UpdateProposalBody} updateBody
 * @returns {Promise<IProposalDoc | null>}
 */
export const updateProposalById = async (
  proposalId: mongoose.Types.ObjectId,
  updateBody: UpdateProposalBody,
  force = false
): Promise<IProposalDoc | null> => {
  try {
    const proposal = await Proposal.findById(proposalId).populate('freelancer')
    if (!proposal) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
    }
    if (proposal.currentStatus === EStatus.ACCEPTED && !force) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Proposal is already accepted')
    }
    const isJobOpen = await isJobOpened(proposal?.job?._id || proposal?.job?.id, proposal as IProposalDoc, false)
    if (!isJobOpen) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The job is not open anymore')
    }
    const appInfo = await getAppInfo()
    updateJobsPointsById(
      proposal?.freelancer?.user,
      appInfo?.freelancerSicks?.updateProposalCost + (proposal?.priority || 0) * 2,
      true
    )

    Object.assign(proposal, updateBody)
    await proposal.save()
    return proposal
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, `cannot updated, ${e}`)
  }
}

/**
 * Delete proposal by id
 * @param {mongoose.Types.ObjectId} proposalId
 * @returns {Promise<IProposalDoc | null>}
 */
export const deleteProposalById = async (proposalId: mongoose.Types.ObjectId): Promise<IProposalDoc | null> => {
  const proposal = await getProposalById(proposalId)
  if (proposal.currentStatus === EStatus.ACCEPTED) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Proposal is already accepted, you only can cancel it')
  }
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
  }
  await proposal.deleteOne()
  return proposal
}

/**
 * Delete proposal by id
 * @param {mongoose.Types.ObjectId} proposalId
 * @param {string} status
 * @param {string} comment
 * @returns {Promise<IProposalDoc | null>}
 */
export const updateProposalStatusById = async (
  proposalId: mongoose.Types.ObjectId,
  status: EStatus,
  comment?: string
): Promise<IProposalDoc | null> => {
  const proposal = await Proposal.findById(proposalId).populate({ path: 'freelancer' }).populate({ path: 'job' })
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
  }

  if (!proposal?.status?.length) {
    proposal.status = [
      {
        status,
        comment,
        date: new Date(),
      },
    ]
  }

  proposal.status?.push({
    status,
    comment,
    date: new Date(),
  })

  await proposal.save()
  return proposal
}

export const updateProposalStatusBulk = async (
  proposalIds: mongoose.Types.ObjectId[],
  status: EStatus,
  comment?: string
): Promise<IProposalDoc[]> => {
  const proposals = await Proposal.find({ _id: { $in: proposalIds } })
    .populate('freelancer')
    .populate('job')

  if (!proposals || proposals.length !== proposalIds.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'One or more proposals not found')
  }

  const bulkUpdateOperations = proposals.map(proposal => ({
    updateOne: {
      filter: { _id: proposal._id },
      update: {
        $set: {
          status: [
            ...(proposal.status || []),
            {
              status,
              comment,
              date: new Date(),
            },
          ],
          currentStatus: status,
        },
      },
    },
  }))

  await Proposal.bulkWrite(bulkUpdateOperations)

  return proposals
}

/**
 * Delete proposal by id
 * @param {mongoose.Types.ObjectId} proposalId
 * @param {string} status
 * @param {string} comment
 * @returns {Promise<IProposalDoc | null>}
 */
export const rejectProposalById = async (
  proposalId: mongoose.Types.ObjectId,
  comment?: string
): Promise<IProposalDoc | null> => {
  const proposal = await updateProposalStatusById(proposalId, EStatus.REJECTED, comment)
  createNotify({
    to: proposal?.freelancer?.user,
    path: FERoutes.allProposals + (proposal?._id || ''),
    attachedId: proposal?._id,
    content: FEMessage(proposal?.job?.title).rejectProposal,
  })
  return proposal
}

/**
 * withdraw proposal by id
 * @param {mongoose.Types.ObjectId} proposalId
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IProposalDoc | null>}
 */
export const withdrawProposalById = async (
  proposalId: mongoose.Types.ObjectId,
  freelancerId: mongoose.Types.ObjectId
): Promise<IProposalDoc | null> => {
  const proposal = await Proposal.findOne({ _id: proposalId, freelancer: freelancerId }).populate('freelancer')
  const isJobOpen = await isJobOpened(proposal.job, proposal as IProposalDoc, false)
  if (!isJobOpen) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The job is not open anymore')
  }
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
  }

  const job = await Job.findById(proposal?.job?._id)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal`s Job not found')
  }

  updateJobsPointsById(proposal?.freelancer?.user, proposal?.sickUsed || 2, false)

  job.proposals = job.proposals.filter(p => p._id !== proposal._id)
  job.appliedFreelancers = job.appliedFreelancers.filter(p => p !== proposal?.freelancer?._id)

  updateProposalStatusById(proposal?.id, EStatus.ARCHIVE, 'Withdraw by Freelancer')

  // Object.assign(proposal, {
  //   status: {
  //     status: EStatus.ARCHIVE,
  //     comment: 'Withdraw by Freelancer',
  //     date: new Date(),
  //   },
  // })

  // await proposal.save()
  deleteNotifyByOption({ attachedId: proposal?._id })
  await job.save()
  return proposal
}

/**
 * Register a proposal
 * @param {NewCreatedProposal} proposalBody
 * @param {ObjectId} userId
 * @returns {Promise<IProposalDoc>}
 */
export const reSubmitProposal = async (
  proposalId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<IProposalDoc> => {
  const proposal = await Proposal.findById(proposalId).populate({
    path: 'freelancer',
    populate: { path: 'user' },
  })
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found proposal!')
  }
  const isJobOpen = await isJobOpened(proposal.job, proposal as IProposalDoc)
  if (!isJobOpen) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Either you or your proposal is incompatible with job!')
  }
  try {
    // const appInfo = await getAppInfo()
    // updateJobsPointsById(proposal?.freelancer?.user?._id, appInfo?.freelancerSicks?.proposalCost + (proposal?.priority || 0) * 2, true)

    updateProposalStatusById(proposalId, EStatus.PENDING, 'Re-Submit after withdrawn by freelancer')

    proposal['currentStatus'] = EStatus.PENDING

    const jobInfo = await addProposaltoJobById(proposal.job, proposal._id)
    const job = await addApplytoJobById(proposal.job, proposal.freelancer)

    createNotify({
      to: jobInfo?.client?.user,
      path: FERoutes.jobDetail + (jobInfo?._id || ''),
      attachedId: proposal?._id,
      content: FEMessage(jobInfo?.title).createProposal,
    })

    if (proposal?.priority > EPriority.MEDIUM) {
      sendCreatedNotifyProposal(
        job?.client?.user?.email,
        job?.client?.user?.name,
        FERoutes.jobDetail + (jobInfo?._id || ''),
        proposal?.freelancer?.user?.name,
        job?.title,
        proposal
      )
    }

    return proposal
  } catch (err: any) {
    Proposal.findByIdAndDelete(proposal?._id)
    logger.error('cannot create proposal', err)
    throw new ApiError(httpStatus.BAD_REQUEST, 'cannot create proposals')
  }
}

/**
 * Delete proposal by options
 * @param {any} jobId
 * @returns {Promise<void>}
 */
export const deleteProposalByOptions = async (options: any): Promise<void> => {
  Proposal.find(options)
    .select('id')
    .then(data => {
      data.forEach(async d => {
        Message.deleteMany({ proposal: d.id })
        const u = await getFreelancerByOptions({ proposals: { $all: [d.id] } })
        u.proposals = u.proposals.filter(p => p.id !== d.id)
        u.save()
      })
    })
    .then(() => {
      Proposal.deleteMany(options)
      deleteContractByOptions(options)
    })
}
