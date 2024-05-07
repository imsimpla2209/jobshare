import { IClientDoc } from '@modules/client/client.interfaces'
import { IJobCategory, IJobDoc } from '@modules/job/job.interfaces'
import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { ILevelSkill } from '@modules/skill/skill.interfaces'
import { IUserDoc } from '@modules/user/user.interfaces'
import { EComplexity, EPaymenType } from 'common/enums'
import { IReview } from 'common/interfaces/subInterfaces'
import { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'

export interface IFreelancer {
  user: IUserDoc['_id']
  name: string
  intro?: string
  title?: string
  members?: IUserDoc['_id'][]
  // tests?: ITestDoc['_id'][]
  skills?: ILevelSkill[]
  certificate?: string
  expertiseLevel?: EComplexity
  proposals?: IProposalDoc['_id'][]
  jobs?: IJobDoc['_id'][]
  relevantClients?: IClientDoc['_id'][]
  images?: string[]
  reviews?: IReview[]
  favoriteJobs?: IJobDoc['_id'][]
  preferJobType?: IJobCategory['_id'][]
  currentLocations?: string[]
  preferencesURL?: string[]
  rating?: number
  jobsDone?: { number: number; success: number }
  earned?: number
  available?: boolean
  education?: any
  historyWork?: any
  englishProficiency?: any
  otherLanguages?: any
  profileCompletion?: number
  expectedAmount?: number
  expectedPaymentType?: EPaymenType
  isSubmitProfile?: boolean
  isProfileVerified?: boolean
  favoriteClients?: IClientDoc['_id'][]
}

export interface ISimilarFreelancer extends Document {
  freelancer: IFreelancerDoc['_id']
  similarKeys?: string
  similarJobCats?: string[]
  similarLocations?: string[]
  similarSkills?: string[]
  potentialJobCats?: string[]
  potentialSkills?: string[]
  similarTags?: string[]
  similarClients?: string[]
}

export interface ISimilarFreelancerModel extends Model<ISimilarFreelancer> {}

export interface IFreelancerDoc extends IFreelancer, Document {}

export interface IFreelancerModel extends Model<IFreelancerDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateFreelancerBody = Omit<IFreelancer, 'user'>

export type NewRegisteredFreelancer = Omit<
  IFreelancer,
  | 'members'
  | 'tests'
  | 'title'
  | 'onJobs'
  | 'isSubmitProfile'
  | 'isProfileVerified'
  | 'reviews'
  | 'proposals'
  | 'favoriteJobs'
  | 'rating'
  | 'jobsDone'
  | 'earned'
  | 'available'
  | 'jobs'
  | 'relevantClients'
  | 'education'
  | 'historyWork'
  | 'englishProficiency'
  | 'otherLanguages'
  | 'profileCompletion'
  | 'expectedAmount'
  | 'expectedPaymentType'
  | 'expertiseLevel'
  | 'favoriteClients'
>
