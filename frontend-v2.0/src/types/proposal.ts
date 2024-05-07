import { EStatus } from 'src/utils/enum'
import { filterFreelancersQuery } from './freelancer'

export interface IProposal {
  _id?: string
  job: any
  freelancer: string
  expectedAmount?: number
  description?: string
  status?: [{ status: EStatus; date: Date }]
  clientComment?: string[]
  freelancerComment?: string[]
  attachments?: string[]
  contract?: string
  messages?: string[]
  answers?: any
  priority?: number
  currentStatus?: EStatus
}

export interface IProposalQuery extends filterFreelancersQuery {
  freelancer?: string
  currentStatus?: EStatus
  job?: string
  _id?: string
  'status.status'?: EStatus
}
