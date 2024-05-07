import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { IUserDoc } from '@modules/user/user.interfaces'
import { EStatus } from 'common/enums'
import mongoose, { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'
import { AccessAndRefreshTokens } from '../token/token.interfaces'

export interface IMessage {
  from?: IUserDoc['_id']
  to?: IUserDoc['_id']
  content?: string
  type?: string
  other?: string
  attachments?: string[]
  room?: IMessageRoomDoc['_id']
  seen?: boolean
  isDeleted?: boolean
}

export interface IMessageRoom {
  proposalStatusCatalog?: string[]
  member?: IUserDoc['_id'][]
  proposal?: IProposalDoc['_id']
  status?: [{ status: EStatus; date: Date }]
  background?: string
  image?: string
  isDeleted?: boolean
  seen?: boolean
  type?: string
  purpose?: string
  attachments?: string[]
}

export interface IMessageDoc extends IMessage, Document {}
export interface IMessageRoomDoc extends IMessageRoom, Document {}

export interface IMessageRoomModel extends Model<IMessageRoomDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export interface IMessageModel extends Model<IMessageDoc> {
  isUserSigned(user: mongoose.Types.ObjectId, excludeMessageId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateMessageBody = Omit<IMessage, 'from' | 'to'>

export type NewCreatedMessage = Omit<
  IMessage,
  'status' | 'messages' | 'contract' | 'freelancerComment' | 'clientComment' | 'isDeleted'
>

export type NewCreatedMessageRoom = Partial<IMessageRoom>

export interface IMessageWithTokens {
  user: IMessageDoc
  tokens: AccessAndRefreshTokens
}
