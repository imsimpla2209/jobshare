import { EPaymenType } from 'src/utils/enum'

export interface SkillBody {
  skill: any
  level: number
}

export interface NewRegisteredFreelancer {
  user: string
  name: string
  intro?: string
  skills?: SkillBody[]
  certificate?: string
  images?: string[]
  preferJobType?: string[]
  currentLocations?: string[]
  preferencesURL?: string[]
}

export interface IFreelancer {
  _id: string
  id: string
  user: string
  name: string
  intro?: string
  title?: string
  members?: string[]
  // tests?: ITestDoc['_id'][]
  skills?: SkillBody[]
  certificate?: string
  proposals?: string[]
  images?: string[]
  reviews?: IReview[]
  favoriteJobs?: string[]
  preferJobType?: any[]
  currentLocations?: string[]
  preferencesURL?: string[]
  rating?: number
  jobsDone?: { number: number; success: number }
  earned?: number
  available?: boolean
  expertiseLevel?: number
  education?: any
  historyWork?: any
  englishProficiency?: any
  otherLanguages?: any
  profileCompletion?: number
  expectedAmount?: number
  expectedPaymentType?: EPaymenType
  isSubmitProfile?: boolean
  isProfileVerified?: boolean
  favoriteClients?: string[]
}

export interface UpdateFreelancer {
  name?: string
  intro?: string
  title?: string
  skills?: SkillBody[]
  certificate?: string
  images?: string[]
  preferJobType?: string[]
  currentLocations?: string[]
  preferencesURL?: string[]
  available?: boolean
  favoriteJobs?: any[]
  expertiseLevel?: number
  education?: any
  historyWork?: any
  englishProficiency?: any
  otherLanguages?: any
  profileCompletion?: number
  expectedAmount?: number
  expectedPaymentType?: EPaymenType
  favoriteClients?: string[]
}

export interface QueryParams {
  name?: string
  skills?: SkillBody[]
  preferJobType?: string[]
  currentLocations?: string[]
  sortBy?: string
  projectBy?: string
  limit?: number
  page?: number
}

export interface filterFreelancersBody {
  id?: string[]
  name?: string
  intro?: string
  skills?: SkillBody[]
  preferJobType?: string[]
  currentLocations?: string[]
  'jobsDone.number'?: number
  'jobsDone.success'?: number
  earned?: { from: number; to: number }
  rating?: { from: number; to: number }
  available?: boolean
}

export interface filterFreelancersQuery {
  sortBy?: string
  projectBy?: string
  limit?: number
  page?: number
}

export interface IReview {
  creator: string
  content: string
  rating?: number
  isAnonymous?: boolean
}
