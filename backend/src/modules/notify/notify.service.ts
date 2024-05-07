/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { io } from '@core/libs/SocketIO'
import { ESocketEvent, EStatus } from 'common/enums'
import { logger } from 'common/logger'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IInvitation, IInvitationDoc, INotifyDoc, NewCreatedNotify, UpdateNotifyBody } from './notify.interfaces'
import Notify, { Invitation } from './notify.model'

/**
 * Register a notify
 * @param {NewCreatedNotify} notifyBody
 * @returns {Promise<INotifyDoc>}
 */
export const createNotify = async (notifyBody: NewCreatedNotify): Promise<INotifyDoc> => {
  // const onlineUsers = await io.getAllOnlineUsers()
  // if (onlineUsers[notifyBody?.to]) {
  //   logger.info(`Send notify to user: ${notifyBody?.to}`)
  //   onlineUsers[notifyBody?.to].socket.emit(ESocketEvent.SENDNOTIFY, notifyBody)
  //   // .to(io.onlineUsers[notifyBody?.to]?.socketId)
  // }
  const onlineUser = await io.getOnlineUserWithSocket(notifyBody?.to?.toString())
  if (onlineUser) {
    logger.info(`Send notify to user: ${notifyBody?.to}`)
    io.sendToId(onlineUser.socketId, ESocketEvent.SENDNOTIFY, notifyBody)
    // onlineUser[messageBody?.to].socket.emit(ESocketEvent.SENDMSG, messageBody)
  }
  return Notify.create(notifyBody)
}

export const bulkCreateNotify = async (notifyBodies: NewCreatedNotify[]): Promise<any> => {
  try {
    const notifyOperations = notifyBodies.map(notifyBody => ({
      insertOne: {
        document: notifyBody,
      },
    }))

    // Perform the bulk write operation
    await Notify.bulkWrite(notifyOperations)

    // Notify online users if necessary
    const notifiedUsers = notifyBodies?.forEach(notifyBody => {
      createNotify(notifyBody)
    })

    return notifiedUsers
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, `Cannot write notifies:${error}`)
  }
}

export const createNotifyforAll = async (notifyBody: NewCreatedNotify, event?: ESocketEvent): Promise<INotifyDoc> => {
  await io.broadcastAll(event || ESocketEvent.SENDNOTIFY, notifyBody)
  return Notify.create(notifyBody)
}

/**
 * Query for notifys
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryNotifys = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  filter['to'] && (filter['to'] = { to: `${filter['to']}` })
  filter['seen'] && (filter['seen'] = { seen: `${filter['seen']}` })

  const filterExtract = Object.keys(filter).map(f => filter[f])
  const queryFilter = {
    $and: [...filterExtract, { isDeleted: { $ne: true } }],
  }

  // options.populate = 'proposal,members'
  if (!options.projectBy) {
    options.projectBy = 'to, path, seen, isDeleted, content, image, createdAt,'
  }

  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc'
  }

  if (!options.limit) {
    options.limit = 200
  }

  const notifys = await Notify.paginate(queryFilter, options)
  return notifys
}

/**
 * Get notify by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<INotifyDoc | null>}
 */
export const getNotifyById = async (id: mongoose.Types.ObjectId): Promise<INotifyDoc | null> => Notify.findById(id)

/**
 * Get notify by notifyname
 * @param {string} notifyname
 * @returns {Promise<INotifyDoc | null>}
 */
export const getNotifyByNotifyname = async (notifyname: string): Promise<INotifyDoc | null> =>
  Notify.findOne({ notifyname })

/**
 * Get notify by email
 * @param {string} email
 * @returns {Promise<INotifyDoc | null>}
 */
export const getNotifyByEmail = async (email: string): Promise<INotifyDoc | null> => Notify.findOne({ email })

/**
 * Get notify by option
 * @param {object} options
 * @returns {Promise<INotifyDoc | null>}
 */
export const getNotifyByOptions = async (Options: any): Promise<INotifyDoc | null> => Notify.findOne(Options)

/**
 * Update notify by id
 * @param {mongoose.Types.ObjectId} notifyId
 * @param {UpdateNotifyBody} updateBody
 * @returns {Promise<INotifyDoc | null>}
 */
export const updateNotifyById = async (
  notifyId: mongoose.Types.ObjectId,
  updateBody: UpdateNotifyBody
): Promise<INotifyDoc | null> => {
  const notify = await getNotifyById(notifyId)
  if (!notify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notify not found')
  }
  Object.assign(notify, updateBody)
  await notify.save()
  return notify
}

/**
 * Update many notify by options
 * @param {any} options
 * @param {UpdateNotifyBody} updateBody
 * @returns {Promise<any | null>}
 */
export const updateManyNotifyByOptions = async (options: any, updateBody: UpdateNotifyBody): Promise<any | null> => {
  try {
    const notify = await Notify.updateMany(options, updateBody)
    return notify
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update these notifies')
  }
}

/**
 * Delete notify by id
 * @param {mongoose.Types.ObjectId} notifyId
 * @returns {Promise<INotifyDoc | null>}
 */
export const deleteNotifyById = async (notifyId: mongoose.Types.ObjectId): Promise<INotifyDoc | null> => {
  const notify = await getNotifyById(notifyId)
  if (!notify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notify not found')
  }
  await notify.deleteOne()
  return notify
}

/**
 * Delete notify by Option
 * @param {any} notifyOption
 * @returns {Promise<INotifyDoc | null>}
 */
export const deleteNotifyByOption = async (notifyOption: any): Promise<INotifyDoc | null> => {
  const notify = await getNotifyByOptions(notifyOption)
  if (!notify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notify not found')
  }
  await notify.deleteOne()
  return notify
}

// <----- Invitation ----->

/**
 * Create a invitation
 * @param {NewCreatedInvitation} invitationBody
 * @returns {Promise<IInvitationDoc>}
 */
export const createInvitation = async (invitationBody: IInvitation): Promise<IInvitationDoc> => {
  // if (await Invitation.isUserSigned(invitationBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Invitation')
  // }
  // if (io.onlineUsers[invitationBody?.to]) {
  //   logger.info(`Send invitation to user: ${invitationBody?.to}`)
  //   io.onlineUsers[invitationBody?.to].socket.emit(ESocketEvent.SENDNOTIFY, invitationBody)
  //   // .to(io.onlineUsers[invitationBody?.to]?.socketId)
  // }
  if (!invitationBody?.dueDate) {
    const future = new Date()
    future.setTime(future.getTime() + 30 * 24 * 60 * 60 * 1000)
    invitationBody['dueDate'] = future.getTime().toString()
  }
  return Invitation.create(invitationBody)
}

/**
 * Query for invitations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryInvitations = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  filter['to'] && (filter['to'] = { to: `${filter['to']}` })
  filter['from'] && (filter['from'] = { from: `${filter['from']}` })
  filter['seen'] && (filter['seen'] = { seen: `${filter['seen']}` })
  filter['currentStatus'] && (filter['currentStatus'] = { currentStatus: `${filter['currentStatus']}` })
  filter['type'] && (filter['type'] = { type: `${filter['type']}` })

  const filterExtract = Object.keys(filter).map(f => filter[f])
  const queryFilter = {
    $and: [...filterExtract, { isDeleted: { $ne: true } }],
  }

  // options.populate = 'proposal,members'
  if (!options.projectBy) {
    options.projectBy =
      'to, background, seen, isDeleted, content, image, createdAt, type, attachments, dueDate, from, currentStatus'
  }

  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc'
  }

  if (!options.limit) {
    options.limit = 20
  }

  const invitations = await Invitation.paginate(queryFilter, options)
  const now = new Date().getTime()

  invitations.results = invitations?.results?.map((i: any) => {
    if (Number(i?.dueDate) >= now && (i.currentStatus === EStatus.PENDING || i.currentStatus === EStatus.INPROGRESS)) {
      if (!i?.status?.length) {
        i.status = [
          {
            status: EStatus.LATE,
            comment: 'Invitation is expired',
            date: new Date(),
          },
        ]
      }
      i.status?.push({
        status: EStatus.LATE,
        comment: 'Invitation is expired',
        date: new Date(),
      })
      Invitation.updateOne({ _id: i._id }, { $set: { status: i.status } })
      return i
    }
    return i
  })
  return invitations
}

/**
 * Get invitation by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IInvitationDoc | null>}
 */
export const getInvitationById = async (id: mongoose.Types.ObjectId): Promise<IInvitationDoc | null> =>
  Invitation.findById(id)

/**
 * Get invitation by option
 * @param {object} options
 * @returns {Promise<IInvitationDoc | null>}
 */
export const getInvitationByOptions = async (Options: any): Promise<IInvitationDoc | null> =>
  Invitation.findOne(Options)

/**
 * Update invitation by id
 * @param {mongoose.Types.ObjectId} invitationId
 * @param {UpdateInvitationBody} updateBody
 * @returns {Promise<IInvitationDoc | null>}
 */
export const updateInvitationById = async (
  invitationId: mongoose.Types.ObjectId,
  updateBody: IInvitation
): Promise<IInvitationDoc | null> => {
  const invitation = await getInvitationById(invitationId)
  if (!invitation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found')
  }
  Object.assign(invitation, updateBody)
  await invitation.save()
  return invitation
}

/**
 * Delete invitation by id
 * @param {mongoose.Types.ObjectId} invitationId
 * @param {string} status
 * @param {string} comment
 * @returns {Promise<IInvitationDoc | null>}
 */
export const updateInvitationStatusById = async (
  invitationId: mongoose.Types.ObjectId,
  status: EStatus,
  comment?: string
): Promise<IInvitationDoc | null> => {
  const invitation = await getInvitationById(invitationId)
  if (!invitation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found')
  }

  const now = new Date().getTime()
  if (Number(invitation.dueDate) < now) {
    if (!invitation?.status?.length) {
      invitation.status = [
        {
          status: EStatus.LATE,
          comment: 'Invitation is expired',
          date: new Date(),
        },
      ]
    }

    else {
      invitation?.status?.push({
        status: EStatus.LATE,
        comment: 'Invitation is expired',
        date: new Date(),
      })
    }

    await invitation.save()
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation is Expired')
  }
  else {
    if (!invitation?.status?.length) {
      invitation.status = [
        {
          status,
          comment,
          date: new Date(),
        },
      ]
    } else {
      invitation?.status?.push({
        status,
        comment,
        date: new Date(),
      })
    }
  
    await invitation.save()
  }

  return invitation
}

/**
 * Update many invitation by options
 * @param {any} options
 * @param {UpdateInvitationBody} updateBody
 * @returns {Promise<any | null>}
 */
export const updateManyInvitationByOptions = async (options: any, updateBody: IInvitation): Promise<any | null> => {
  try {
    const invitation = await Invitation.updateMany(options, updateBody)
    return invitation
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update these notifies')
  }
}

/**
 * Delete invitation by id
 * @param {mongoose.Types.ObjectId} invitationId
 * @returns {Promise<IInvitationDoc | null>}
 */
export const deleteInvitationById = async (invitationId: mongoose.Types.ObjectId): Promise<IInvitationDoc | null> => {
  const invitation = await getInvitationById(invitationId)
  if (!invitation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found')
  }
  await invitation.deleteOne()
  return invitation
}
