import {
  filterFreelancersBody,
  filterFreelancersQuery,
  IReview,
  NewRegisteredFreelancer,
  QueryParams,
  UpdateFreelancer,
} from 'src/types/freelancer'
import { Http, instance } from './http'

export const registerAsFreelancer = (data: NewRegisteredFreelancer) => {
  return instance.post('freelancers', data)
}

export const getFreelancers = (data: QueryParams) => {
  return Http.get('freelancers', data)
}

export const getFreelancerByOptions = (data: any) => {
  return Http.post('freelancers/get-by-options', data)
}

export const filterFreelancers = (data: filterFreelancersBody, query: filterFreelancersQuery) => {
  return Http.post('freelancers/filter', data, query)
}

export const searchFreelancers = (data: { searchText: string }, query: filterFreelancersQuery) => {
  return Http.post('freelancers/search', data, query)
}

export const getRcmdFreelancers = (data: { jobId: string }, query: filterFreelancersQuery) => {
  return Http.post('freelancers/rcmd', data, query)
}

export const getFreelancer = (id: string) => {
  return instance.get(`freelancers/${id}`)
}

export const getFreelancerByIdWithPopulate = (id: string) => {
  return instance.post(`freelancers/${id}`)
}

export const getFreelancerTracking = () => {
  return instance.get(`freelancers/tracking`)
}

export const getFreelancerTrackingTopType = () => {
  return instance.get(`freelancers/tracking/top-type`)
}

export const getFreelancerTrackingCurrentJobs = () => {
  return instance.get(`freelancers/tracking/current-jobs`)
}

export const getFreelancerTrackingCurrentType = () => {
  return instance.get(`freelancers/tracking/current-type`)
}

export const getFreelancerTrackingIntend = () => {
  return instance.get(`freelancers/tracking/intend`)
}

export const deleteFreelancerTracking = (id: string) => {
  return instance.delete(`freelancers/tracking/${id}`)
}

export const deleteAllFreelancerTracking = () => {
  return instance.get(`freelancers/tracking/all`)
}

export const updateFreelancerTracking = data => {
  return instance.patch(`freelancers/tracking`, data)
}

export const verifyFreelancer = (id: string) => {
  return instance.patch(`freelancers/verify-profile/${id}`)
}

export const updateFreelancer = (data: UpdateFreelancer, id: string) => {
  return instance.patch(`freelancers/${id}`, data)
}

export const updateProfileFreelancer = (data: UpdateFreelancer) => {
  return instance.patch(`freelancers/update-profile`, data)
}

export const deleteFreelancer = (id: string) => {
  return instance.delete(`freelancers/${id}`)
}

export const reviewFreelancer = (data: IReview, id: string) => {
  return instance.patch(`freelancers/review/${id}`, data)
}

export const forcedDeleteFreelancer = (id: string) => {
  return instance.delete(`freelancers/admin/${id}`)
}
