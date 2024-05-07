import { EStatus } from "src/utils/enum"

export interface IPayment {
  from: string
  to: string
  amount?: number
  status?: string
  paymentMethod?: string
}

export interface IContract {
  proposal: string
  job: string
  freelancer: string
  client: string
  overview?: string
  status?: [
    {
      status: EStatus
      date: Date
      comment: string
    }
  ] | string
  startDate?: Date
  endDate?: Date
  paymentType?: string
  agreeAmount?: number
  catalogs?: string[]
  attachments?: string[]
  paymentHistory?: IPayment[]
  currentStatus?: string
}

export interface IContractQuery {
  proposal?: string,
  freelancer?: string,
  client?: string,
  job?: string,
  currentStatus?: EStatus,
  sortBy?: string
  projectBy?: string
  limit?: number
  page?: number
}