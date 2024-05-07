/* eslint-disable no-param-reassign */
import { getClientById } from '@modules/client/client.service'
import { addJobtoFreelancer, getFreelancerById, updateSimilarById } from '@modules/freelancer/freelancer.service'
import { IJobDoc } from '@modules/job/job.interfaces'
import { changeStatusJobById, getJobById } from '@modules/job/job.service'
import { createInvitation, createNotify, updateInvitationStatusById } from '@modules/notify/notify.service'
import { updateProposalStatusById } from '@modules/proposal/proposal.service'
import { EInvitationType, EJobStatus, EPaymenType, EStatus } from 'common/enums'
import { FEMessage, FERoutes } from 'common/enums/constant'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { getWorkTime } from 'utils/calculator'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IContractDoc, NewCreatedContract, UpdateContractBody } from './contract.interfaces'
import Contract from './contract.model'

export const validateContract = (contractBody: NewCreatedContract, job: IJobDoc) => {
  let checkFlag = true

  const workTime = getWorkTime(contractBody.startDate, contractBody.endDate, contractBody?.paymentType)
  switch (contractBody?.paymentType) {
    case EPaymenType.PERHOURS:
    case EPaymenType.PERMONTH:
      if (workTime * contractBody.agreeAmount > job?.budget) {
        checkFlag = false
      }
      break
    case EPaymenType.PERTASK:
      break
    case EPaymenType.PERWEEK:
      break
    case EPaymenType.WHENDONE:
      break
    default:
      checkFlag = false
  }

  return checkFlag
}

/**
 * close all contract
 * @param {NewCreatedContract} jobId
 * @param {bool} isAgree
 * @returns {Promise<IContractDoc>}
 */
export const closeAllContract = (
  jobId: mongoose.Types.ObjectId,
  contractId?: mongoose.Types.ObjectId
): Promise<any> => {
  return Contract.updateMany(
    { _id: { $ne: contractId }, job: jobId, currentStatus: EStatus.PENDING },
    { currentStatus: EStatus.REJECTED }
  )
}

/**
 * create a contract
 * @param {NewCreatedContract} contractBody
 * @param {bool} isAgree
 * @returns {Promise<IContractDoc>}
 */
export const createContract = async (contractBody: NewCreatedContract, isAgree?: boolean): Promise<IContractDoc> => {
  const job = await getJobById(contractBody?.job)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }

  const client = await getClientById(contractBody?.client)
  const freelancer = await getFreelancerById(contractBody?.freelancer)

  if (contractBody?.agreeAmount)
    if (!client || !freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Client or Freelancer not found')
    }

  if (client?.user === freelancer?.user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Done self-make silly contract')
  }

  if (!(job.currentStatus === EJobStatus.OPEN || job.currentStatus === EJobStatus.PENDING)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job is not open or pending')
  }

  const acceptedContracts = await Contract.countDocuments({ job: job?._id, currentStatus: EStatus.ACCEPTED })

  if (acceptedContracts >= job?.preferences?.nOEmployee) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job is not in recruiment anymore')
  }

  await updateProposalStatusById(contractBody?.proposal, EStatus.ACCEPTED, 'Accept from client and create contract')

  createNotify({
    to: freelancer?.user,
    path: isAgree ? FERoutes.myJobs : `${FERoutes.allInvitation}`,
    content: isAgree ? FEMessage().gotJob : FEMessage().createContract,
  })

  // if (contractBody?.proposal) {
  //   updateProposalStatusById(contractBody?.proposal, EStatus.ACCEPTED, 'Accepted by Client')
  // }

  if (isAgree) {
    addJobtoFreelancer(job._id, freelancer?._id, client?._id)
    const createdContract = await Contract.create({
      ...contractBody,
      status: {
        status: EStatus.ACCEPTED,
        date: new Date(),
        comment: 'Initially Accepted by both side',
      },
    })
    if ((job?.preferences?.nOEmployee ?? 1) - 1 === acceptedContracts) {
      closeAllContract(createdContract?._id, job._id)
    }
    return createdContract
  }
  const createdCX = await Contract.create(contractBody)
  createInvitation({
    to: freelancer?.user,
    type: EInvitationType?.CONTRACT,
    content: {
      content: FEMessage().createContract,
      contractID: createdCX?._id,
      job,
      from: client,
      proposal: contractBody?.proposal,
    },
    from: client?.user,
  })
  updateSimilarById(freelancer._id)
  return createdCX
}

/**
 * Get contract by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IContractDoc | null>}
 */
export const getContractById = async (id: mongoose.Types.ObjectId): Promise<IContractDoc | null> =>
  Contract.findById(id).lean()

/**
 * Get contract by option
 * @param {object} options
 * @returns {Promise<IContractDoc | null>}
 */
export const getContractsByOptions = async (Options: any): Promise<IContractDoc | null> => Contract.find(Options).lean()

/**
 * Change status contract by id
 * @param {mongoose.Types.ObjectId} contractId
 * @param {string} status
 * @returns {Promise<IContractDoc | null>}
 */
export const changeStatusContractById = async (
  contractId: mongoose.Types.ObjectId,
  status: EStatus,
  comment: string
): Promise<IContractDoc | null> => {
  const contract = await Contract.findById(contractId)
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'contract not found')
  }

  const now = new Date().getTime()
  const endDate = new Date(contract.endDate).getTime()
  if (endDate < now) {
    contract.status?.push({
      status: EStatus.LATE,
      comment: 'contract is expired',
      date: new Date(),
    })
    await contract.save()
    throw new ApiError(httpStatus.BAD_REQUEST, 'contract is Expired')
  }
  contract.status?.push({
    status,
    comment,
    date: new Date(),
  })
  const contractUpdated = await contract.save()
  return contractUpdated
}

/**
 * create a contract
 * @param {mongoose.Types.ObjectId} contractId
 * @param {mongoose.Types.ObjectId} invitationId
 * @returns {Promise<IContractDoc>}
 */
export const acceptContract = async (
  contractId: mongoose.Types.ObjectId,
  invitationId: mongoose.Types.ObjectId
): Promise<IContractDoc> => {
  const contract = await getContractById(contractId)
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'contract not found')
  }

  const job = await getJobById(contract?.job)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }

  if (job.currentStatus !== EJobStatus.OPEN) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job is not open')
  }

  const acceptedContracts = await Contract.countDocuments({ job: job?._id, currentStatus: EStatus.ACCEPTED })

  if (acceptedContracts >= job?.preferences?.nOEmployee) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job is not in recruiment anymore')
  }

  await updateInvitationStatusById(invitationId, EStatus.ACCEPTED, 'Accepted by User')

  if ((job?.preferences?.nOEmployee ?? 1) - 1 === acceptedContracts) {
    closeAllContract(contractId, job._id)
    changeStatusJobById(job._id, EJobStatus.COMPLETED, 'Enough Workers for this job')
  }

  const acceptedContract = await changeStatusContractById(contract?._id, EStatus.ACCEPTED, 'Accepted from Both side')
  addJobtoFreelancer(job._id, contract?.freelancer, job?.client)
  createNotify({
    to: job?.client?.user,
    path: `${FERoutes.allContract}`,
    content: FEMessage().acceptContract,
  })

  updateSimilarById(contract?.freelancer)
  return acceptedContract
}

/**
 * reject a contract
 * @param {mongoose.Types.ObjectId} contractId
 * @param {mongoose.Types.ObjectId} invitationId
 * @returns {Promise<IContractDoc>}
 */
export const rejectContract = async (
  contractId: mongoose.Types.ObjectId,
  invitationId: mongoose.Types.ObjectId
): Promise<IContractDoc> => {
  const contract = await getContractById(contractId)
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'contract not found')
  }

  const job = await getJobById(contract?.job)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }

  if (!(job.currentStatus === EJobStatus.OPEN || job.currentStatus === EJobStatus.PENDING)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job is not open or pending')
  }

  await updateInvitationStatusById(invitationId, EStatus.REJECTED, 'Reject by User')

  const rejectdContract = await changeStatusContractById(contractId, EStatus.REJECTED, 'Reject by User')
  createNotify({
    to: job?.client?.user,
    path: `${FERoutes.allContract}`,
    content: FEMessage().rejectContract,
  })

  return rejectdContract
}

/**
 * Query for contracts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryContracts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  options.populate = 'job,client.user,freelancer.user,createdAt'
  const contracts = await Contract.paginate(filter, options)
  return contracts
}

/**
 * Get contract by contractname
 * @param {string} contractname
 * @returns {Promise<IContractDoc | null>}
 */
export const getContractByContractname = async (contractname: string): Promise<IContractDoc | null> =>
  Contract.findOne({ contractname })

/**
 * Get contract by email
 * @param {string} email
 * @returns {Promise<IContractDoc | null>}
 */
export const getContractByEmail = async (email: string): Promise<IContractDoc | null> => Contract.findOne({ email })

/**
 * Get contract by option
 * @param {object} options
 * @returns {Promise<IContractDoc | null>}
 */
export const getContractByOptions = async (Options: any): Promise<IContractDoc | null> =>
  Contract.findOne(Options).lean()

/**
 * Update contract by id
 * @param {mongoose.Types.ObjectId} contractId
 * @param {UpdateContractBody} updateBody
 * @returns {Promise<IContractDoc | null>}
 */
export const updateContractById = async (
  contractId: mongoose.Types.ObjectId,
  updateBody: UpdateContractBody
): Promise<IContractDoc | null> => {
  const contract = await getContractById(contractId)
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found')
  }
  Object.assign(contract, updateBody)
  await contract.save()
  return contract
}

/**
 * Delete contract by id
 * @param {mongoose.Types.ObjectId} contractId
 * @returns {Promise<IContractDoc | null>}
 */
export const deleteContractById = async (contractId: mongoose.Types.ObjectId): Promise<IContractDoc | null> => {
  const contract = await getContractById(contractId)
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found')
  }
  await contract.deleteOne()
  return contract
}

/**
 * Delete contract by options
 * @param {any} options
 * @returns {Promise<void>}
 */
export const deleteContractByOptions = async (options: any): Promise<void> => {
  await Contract.deleteOne(options)
}
