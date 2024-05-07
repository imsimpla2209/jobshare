import { EComplexity, EJobStatus, EJobType, ELevel, EPaymenType } from 'src/utils/enum'

export interface IJobPayment {
  amount?: number
  type?: EPaymenType
}

export interface IJobScope {
  complexity?: EComplexity
  duration?: number
}

export interface IJobPreferences {
  nOEmployee?: number
  locations?: string[]
}

export interface ICreateJobBody {
  client: string
  title: string
  description?: string
  type: EJobType
  experienceLevel?: ELevel[]
  reqSkills?: { skill: any; level: number }[]
  checkLists?: string[]
  attachments?: string[]
  categories?: string[]
  budget?: number
  tags?: string[]
  payment?: IJobPayment
  scope?: IJobScope
  questions?: string[]
  preferences?: IJobPreferences
  visibility?: boolean
  jobDuration?: 'short-term' | 'long-term'
}

export interface IGetJobsQuery {
  client?: string
  title?: string
  categories?: string[]
  skills?: string[]
  nOEmployee?: number
  complexity?: string
  duration?: number
  description?: string
  sortBy?: string
  projectBy?: string
  limit?: number
  page?: number
  searchText?: string
  currentStatus?: EJobStatus[]
}

export interface IAdvancedGetJobsBody {
  title?: string
  nOEmployee?: { from?: number; to?: number }
  locations?: string[]
  complexity?: number[]
  duration?: { from?: number; to?: number }
  paymentAmount?: { from?: number; to?: number }
  proposals?: { from?: number; to?: number }
  clientInfo?: string[]
  clientHistory?: string
  paymentType?: EPaymenType[]
  description?: string
  budget?: { from?: number; to?: number }
  categories?: string[]
  tags?: string[]
  currentStatus?: string[]
  searchText?: string
}

export interface IAdvancedGetJobsQuery {
  sortBy?: string
  projectBy?: string
  limit?: number
  page?: number
}
