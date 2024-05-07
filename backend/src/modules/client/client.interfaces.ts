import { IFreelancerDoc } from '@modules/freelancer/freelancer.interfaces'
import { IJobCategory, IJobDoc } from '@modules/job/job.interfaces'
import { IUserDoc } from '@modules/user/user.interfaces'
import { IReview } from 'common/interfaces/subInterfaces'
import mongoose, { Document, Model } from 'mongoose'
import { ISkillDoc } from '@modules/skill/skill.interfaces'
import { QueryResult } from '../../providers/paginate/paginate'

export interface IClient {
  user: IUserDoc['_id']
  name?: string
  intro?: string
  rating?: number
  jobs?: IJobDoc['_id'][]
  organization?: IOrganizationDoc['_id']
  reviews?: IReview[]
  images?: string[]
  preferencesURL?: string[]
  preferLocations?: string[]
  preferJobType?: IJobCategory['_id'][]
  findingSkills?: ISkillDoc['_id'][]
  favoriteFreelancers?: IFreelancerDoc['_id'][]
  paymentVerified?: boolean
  spent?: number
}

export interface IOrganizationDoc extends Document {
  name: string
}

export interface IClientDoc extends IClient, Document {}

export interface IClientModel extends Model<IClientDoc> {
  isUserSigned(user: mongoose.Types.ObjectId, excludeClientId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export interface IOrganizationModel extends Model<IOrganizationDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateClientBody = Omit<IClient, 'user' | 'spent' | 'paymentVerified'>

export type NewRegisteredClient = Omit<IClient, 'rating' | 'jobs' | 'reviews' | 'images' | 'spent' | 'paymentVerified'>
