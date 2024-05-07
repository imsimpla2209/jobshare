import { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'

export interface ISkill {
  name: string
  name_vi: string
  category: string
  isDeleted: boolean
}

export interface ILevelSkill {
  skill: ISkillDoc['_id']
  level: number
}

export interface ISkillDoc extends ISkill, Document {}

export interface ISkillModel extends Model<ISkillDoc> {
  isNameTaken(name: string): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateSkillBody = ISkill

export type NewCreatedSkill = Omit<ISkill, 'isDeleted'>

export type UpdateFreelancerSkillBody = Omit<ILevelSkill, 'skill' | 'freelancer'>

export type NewFreelancerSkill = ILevelSkill
