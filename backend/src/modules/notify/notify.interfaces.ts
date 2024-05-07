import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { IUserDoc } from '@modules/user/user.interfaces'
import { EStatus } from 'common/enums'
import mongoose, { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'
import { AccessAndRefreshTokens } from '../token/token.interfaces'

export interface INotify {
  to: IUserDoc['_id']
  path?: string
  content?: any
  image?: string
  attachedId?: string
  seen?: boolean
  isDeleted?: boolean
}

export interface IInvitation {
  to: IUserDoc['_id']
  from: IUserDoc['_id']
  content?: any
  type?: string
  image?: string
  background?: string
  seen?: boolean
  status?: [
    {
      status: EStatus
      date: Date
      comment: string
    }
  ]
  dueDate?: any
  isDeleted?: boolean
  currentStatus?: string
  attachments?: string[]
}

export interface INotifyRoom {
  proposalStatusCatalog?: string[]
  members?: IUserDoc['_id'][]
  proposal?: IProposalDoc['_id']
  status?: [{ status: EStatus; date: Date }]
  background?: string
  image?: string
  isDeleted?: boolean
}

export interface INotifyDoc extends INotify, Document {}
export interface INotifyRoomDoc extends INotifyRoom, Document {}
export interface IInvitationDoc extends IInvitation, Document {}

export interface IInvitationModel extends Model<IInvitationDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export interface INotifyRoomModel extends Model<INotifyRoomDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export interface INotifyModel extends Model<INotifyDoc> {
  isUserSigned(user: mongoose.Types.ObjectId, excludeNotifyId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateNotifyBody = Omit<INotify, 'freelancer' | 'job'>

export type NewCreatedNotify = Omit<
  INotify,
  'status' | 'messages' | 'contract' | 'freelancerComment' | 'clientComment' | 'isDeleted'
>

export type NewCreatedNotifyRoom = Partial<INotifyRoom>

export interface INotifyWithTokens {
  user: INotifyDoc
  tokens: AccessAndRefreshTokens
}
