import { createSubscription } from 'libs/global-state-hook'
import { IJobPayment, IJobPreferences, IJobScope } from 'src/types/job'

export interface IJobData {
  _id: string
  client: any
  title: string
  description?: string
  currentStatus?: string
  type: string
  isDeleted?: boolean
  experienceLevel?: string[]
  reqSkills?: any[]
  checkLists?: string[]
  attachments?: string[]
  categories?: any[]
  budget?: number
  tags?: any[]
  status?: [
    {
      status: string
      date: Date
      comment?: string
    }
  ]
  proposals?: any[]
  payment?: IJobPayment
  scope?: IJobScope
  questions?: string[]
  createdAt?: any
  updatedAt?: any
  preferences?: IJobPreferences
  visibility?: boolean
  jobDuration?: 'short-term' | 'long-term'
}

export const jobsDataStore = createSubscription<IJobData[]>([])

export enum EJobFilter {
  RCMD = 'rcmd',
  RECENT = 'recent',
  OTHER = 'other',
}

export const jobLoad = createSubscription<{
  filter: string
  isFirstLoad: boolean
  page: number
  categories: string[]
  skills: string[]
  pageSize: number
}>({
  filter: 'rcmd',
  isFirstLoad: true,
  page: 1,
  categories: [],
  skills: [],
  pageSize: 28,
})

export const refreshStore = createSubscription<{ isRefresh: boolean }>({ isRefresh: false })

// export const clientStore = createSubscription<IClient>({
//   user: "",
//   name: "",
//   intro: '',
//   organization: '',
//   // tests: ITestDoc['_id'][]
//   images: [],
//   reviews: [],
//   favoriteFreelancers: [],
//   preferJobType: [],
//   preferLocations: [],
//   preferencesURL: [],
//   rating: 0,
//   jobs: [],
//   spent: 0,
//   paymentVerified: false,
// })

export const emptyFilterOptions = {
  complexity: null,
  categories: null,
  skills: null,
  locations: null,
  paymentType: null,
  currentStatus: null,
  duration: null,
  budget: null,
  paymentAmount: null,
  proposals: null,
  nOEmployee: null,
}

export const advancedSearchJobs = createSubscription<{
  complexity: any[]
  categories: string[]
  skills: string[]
  locations: any[]
  paymentType: any[]
  currentStatus: any[]
  duration: { from: number; to: number }
  budget: { from: number; to: number }
  paymentAmount: { from: number; to: number }
  proposals: { from: number; to: number }
  nOEmployee: { from: number; to: number }
}>(emptyFilterOptions)

export const advancedSearchPage = createSubscription<{
  isFirstLoad: boolean
  page: number
  pageSize: number
}>({
  isFirstLoad: true,
  page: 1,
  pageSize: 10,
})
