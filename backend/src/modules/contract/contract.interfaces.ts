import { IClientDoc } from '@modules/client/client.interfaces'
import { IFreelancerDoc } from '@modules/freelancer/freelancer.interfaces'
import { IJobDoc } from '@modules/job/job.interfaces'
import { IPayment } from '@modules/payment/payment.interfaces'
import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { EStatus } from 'common/enums'
import mongoose, { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'
import { AccessAndRefreshTokens } from '../token/token.interfaces'

export interface IContract {
  proposal: IProposalDoc['_id']
  job: IJobDoc['_id']
  freelancer: IFreelancerDoc['_id']
  client: IClientDoc['_id']
  overview?: string
  status?: [
    {
      status: EStatus
      date: Date
      comment: string
    }
  ]
  startDate?: Date
  endDate?: Date
  paymentType?: string
  agreeAmount?: number
  catalogs?: string[]
  attachments?: string[]
  paymentHistory?: IPayment[]
  currentStatus?: string
}

export interface IContractEmployee extends Document {
  freelancer: IFreelancerDoc['_id']
  contract: IContractDoc['_id']
  endDate: string
  status: string
}

export interface IContractDoc extends IContract, Document {}

export interface IContractEmployeeModel extends Model<IContractEmployee> {}

export interface IContractModel extends Model<IContractDoc> {
  isUserSigned(user: mongoose.Types.ObjectId, excludeContractId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateContractBody = Omit<IContract, 'freelancer' | 'job'>

export type NewCreatedContract = Omit<
  IContract,
  'status' | 'messages' | 'contract' | 'freelancerComment' | 'clientComment' | 'paymentHistory' | 'currentStatus'
>

export interface IContractWithTokens {
  user: IContractDoc
  tokens: AccessAndRefreshTokens
}
