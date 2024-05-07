import { IFreelancerDoc } from '@modules/freelancer/freelancer.interfaces'
import { Model } from 'mongoose'

export enum ETrackingEvent {
  JOB_VIEW = 'JOB_VIEW',
  SEARCHING = 'SEARCHING',
  APPLY = 'APPLY',
  VIEWCLIENT = 'VIEWCLIENT',
}

export interface ITrackingEvent {
  [ETrackingEvent.JOB_VIEW]: {
    viewCount: number
    totalTimeView: number
  }
  [ETrackingEvent.SEARCHING]: {
    viewCount: number
    totalTimeView: number
  }
  [ETrackingEvent.APPLY]: {
    viewCount: number
    totalTimeView: number
  }
  [ETrackingEvent.VIEWCLIENT]: {
    viewCount: number
    totalTimeView: number
  }
}

export interface ITrackingData {
  id: string
  text: string
  event: ETrackingEvent
  lastTimeView: number
}

export interface IFreelancerTracking {
  freelancer: IFreelancerDoc['_id']
  jobs: ITrackingData[]
  skills: ITrackingData[]
  categories: ITrackingData[]
  locations: ITrackingData[]
}

export interface IFreelancerTrackingDoc extends IFreelancerTracking, Document {}

export interface IFreelancerTrackingModel extends Model<IFreelancerTrackingDoc> {}
