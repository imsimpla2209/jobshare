import { IContractDoc } from '@modules/contract/contract.interfaces'
import { IUserDoc } from '@modules/user/user.interfaces'
import mongoose, { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'

export interface IPayment {
  purpose: string
  from: IUserDoc['_id']
  to?: IUserDoc['_id']
  isToAdmin?: boolean
  amount?: number
  status?: string
  paymentMethod?: string
  note?: string
}

export interface IPaymentContract extends Document {
  contract?: IContractDoc['_id']
  payment: IPaymentDoc['_id']
}

export interface IPaymentInfo {
  bankName?: string
  bankAccNumber?: string
  bankAccType?: string
  routingNumber?: string
  branchName?: string
  isPrimary?: boolean
  createdAt?: Date
}

export interface IPaymentDoc extends IPayment, Document {}

export interface IPaymentContractModel extends Model<IPaymentContract> {}

export interface IPaymentModel extends Model<IPaymentDoc> {
  isUserSigned(user: mongoose.Types.ObjectId, excludePaymentId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdatePaymentBody = Omit<IPayment, 'freelancer' | 'job'>

export type NewCreatedPayment = Omit<
  IPayment,
  'status' | 'messages' | 'contract' | 'freelancerComment' | 'clientComment'
>
