// import { IMessage, IMessageQuery } from "src/types/Message";
import { EStatus } from 'src/utils/enum'
import { Http, instance } from './http'

export interface IMessage {
  from: string
  to: string
  content?: string
  attachments?: string[]
  room?: string
  seen?: boolean
  isDeleted?: boolean
}

export interface IMessageQuery {
  room?: string
  from?: string
  sortBy?: string
  projectBy?: string
  limit?: number
  page?: number
}

export interface IInvitationsQuery {
  to?: string
  from?: string
  type?: string
  seen?: boolean
  currentStatus?: EStatus
  sortBy?: string
  projectBy?: string
  limit?: number
  page?: number
}

export interface IMessageRoomQuery {
  proposals?: string
  member?: string[]
  sortBy?: string
  projectBy?: string
  limit?: number
  page?: number
}

export interface IMessageRoom {
  member?: string[]
  proposalStatusCatalog?: string[]
  proposal?: string
  background?: string
  image?: string
  attachments?: string[]
  seen?: boolean
  isDeleted?: boolean
}

export interface INotify {
  to: string
  path?: string
  content?: any
  image?: string
  attachedId?: string
  seen?: boolean
  isDeleted?: boolean
}

export const createMessage = (data?: IMessage) => {
  return instance.post('messages', data)
}

export const getMessages = (data: IMessageQuery) => {
  return Http.get('messages', data)
}

export const getMessage = (id: string) => {
  return instance.get(`messages/${id}`)
}

export const checkMessageRoom = (data: any) => {
  return instance.post(`messages/rooms/check`, data)
}

export const acceptMessageRoom = (id: string) => {
  return instance.post(`messages/rooms/accept/${id}`)
}

export const rejectMessageRoom = (id: string) => {
  return instance.post(`messages/rooms/reject/${id}`)
}

export const requestMessageRoom = (data: any) => {
  return instance.post(`messages/rooms/request`, data)
}

export const updateMessage = (data: Omit<IMessage, 'from' | 'to'>, id: string) => {
  return instance.patch(`messages/${id}`, data)
}

export const deleteMessage = (id: string) => {
  return instance.delete(`messages/${id}`)
}

export const createMessageRoom = (data?: IMessageRoom) => {
  return instance.post('messages/rooms/', data)
}

export const getMessageRooms = (data: IMessageRoomQuery) => {
  return instance.get('messages/rooms/', {
    params: data,
    paramsSerializer: { indexes: true },
  })
}

export const updateStatusMessageRoom = (
  id: string,
  statusData: {
    status: EStatus
    comment: string
  }
) => {
  return instance.patch(`messages/rooms/status/${id}`, statusData)
}

export const getMessageRoom = (id: string) => {
  return instance.get(`messages/rooms/${id}`)
}

export const updateMessageRoom = (data: Omit<IMessageRoom, 'proposal'>, id: string) => {
  return instance.patch(`messages/rooms/${id}`, data)
}

export const deleteMessageRoom = (id: string) => {
  return instance.delete(`messages/rooms/${id}`)
}

export const getNotifies = (id: string) => {
  return Http.get('notify', { to: id })
}
export const createNotify = (data?: INotify) => {
  return instance.post('notify', data)
}
export const updateNotifies = (id: string, options: any) => {
  return Http.patch(`notify?to=${id}`, options)
}

export const updateNotify = (id: string, options: any) => {
  return Http.patch(`notify/${id}`, options)
}

export const deleteNotify = (id: string) => {
  return instance.delete(`notify/${id}`)
}

export const getInvitations = (data: IInvitationsQuery) => {
  return Http.get('notify/invitation', data)
}

export const updateInvitations = (id: string, options: any) => {
  return Http.patch(`notify/invitation?to=${id}`, options)
}

export const deleteInvitation = (id: string) => {
  return instance.delete(`notify/invitation/${id}`)
}

export const updateStatusInvitation = (
  id: string,
  statusData: {
    status: EStatus
    comment: string
  }
) => {
  return instance.patch(`notify/invitation/status/${id}`, statusData)
}
