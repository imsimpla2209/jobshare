import { IContractDoc } from '@modules/contract/contract.interfaces'
import { IFreelancerDoc } from '@modules/freelancer/freelancer.interfaces'
import { IJobDoc } from '@modules/job/job.interfaces'
import { IMessageDoc } from '@modules/message/message.interfaces'
import { EStatus } from 'common/enums'
import mongoose, { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'
import { AccessAndRefreshTokens } from '../token/token.interfaces'

export interface IProposal {
  job: IJobDoc['_id']
  freelancer: IFreelancerDoc['_id']
  expectedAmount?: number
  description?: string
  status?: [{ status: EStatus; comment: string; date: Date }]
  clientComment?: string[]
  freelancerComment?: string[]
  attachments?: string[]
  contract?: IContractDoc['_id']
  messages?: IMessageDoc['_id'][]
  answers?: any
  priority?: number
  currentStatus?: string
  msgRequestSent?: boolean
  sickUsed?: number
}

export interface IProposalEmployee extends Document {
  freelancer: IFreelancerDoc['_id']
  proposal: IProposalDoc['_id']
  endDate: string
  status: string
}

export interface IProposalDoc extends IProposal, Document {}

export interface IProposalEmployeeModel extends Model<IProposalEmployee> {}

export interface IProposalModel extends Model<IProposalDoc> {
  Proposal(arg0: { job: mongoose.Types.ObjectId }): IProposalDoc | PromiseLike<IProposalDoc>
  isUserSigned(user: mongoose.Types.ObjectId, excludeProposalId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateProposalBody = Omit<IProposal, 'freelancer' | 'job'>

export type NewCreatedProposal = Omit<
  IProposal,
  'status' | 'messages' | 'contract' | 'freelancerComment' | 'clientComment' | 'currentStatus' | 'msgRequestSent'
>

export interface IProposalWithTokens {
  user: IProposalDoc
  tokens: AccessAndRefreshTokens
}
