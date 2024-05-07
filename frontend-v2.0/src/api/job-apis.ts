import { IAdvancedGetJobsBody, IAdvancedGetJobsQuery, ICreateJobBody, IGetJobsQuery } from "src/types/job";
import { Http, instance } from "./http";
import { IReview } from "src/types/freelancer";
import { EJobStatus } from "src/utils/enum";

export const createJob = (data: ICreateJobBody) => {
  return instance.post('jobs', data);
}

export const getJobs = (data?: IGetJobsQuery ) => {
  return Http.get('jobs', data);
}

export const getAllJobs = () => {
  return Http.get('jobs/all');
}

export const getAllJobsforAdmin = () => {
  return Http.get('jobs/allforAdmin');
}

export const filterJobs = (data: IAdvancedGetJobsBody, query: IAdvancedGetJobsQuery ) => {
  return Http.post('jobs/filter', data, query);
}

export const searchJobs = (data: {searchText: string}, query: IAdvancedGetJobsQuery ) => {
  return Http.post('jobs/search', data, query);
}

export const getRcmdJobs = (freelancerId: string, query?: IAdvancedGetJobsQuery, categories?: string[], skills?: string[],  ) => {
  return Http.get(`jobs/rcmd`, {...query, categories, skills, freelancerId});
}

export const getFavJobsByUser = (freelancerId: string, query?: IAdvancedGetJobsQuery) => {
  return Http.get(`jobs/fav`, {...query,  freelancerId});
}

export const getSimilarJobs = (id: string, query?: IAdvancedGetJobsQuery ) => {
  return Http.get(`jobs/similar`, {...query, id});
}

export const getJob = (id: string ) => {
  return instance.get(`jobs/${id}`);
}

export const updateJob = (data: Omit<ICreateJobBody, 'client'>, id: string ) => {
  return instance.patch(`jobs/${id}`, data);
}

export const deleteJob = (id: string) => {
  return instance.delete(`jobs/${id}`);
}

export const reviewJob = (data: IReview, id: string ) => {
  return instance.patch(`jobs/review/${id}`, data);
}

export const changeStatus = (data: {status: EJobStatus, comment?: string }, id: string ) => {
  return instance.patch(`jobs/status/${id}`, data);
}

export const forcedDeleteJob = (id: string) => {
  return instance.delete(`jobs/admin/${id}`);
}

export const getCategories = (data?: IGetJobsQuery) => {
  return Http.get(`jobs/categories`, data);
}
export const getSkills = (data?: IGetJobsQuery) => {
  return Http.get(`jobs/skills`, data);
}

export const getSkillsWithCount = (data?: IGetJobsQuery) => {
  return Http.get(`jobs/skill-sum-by-jobs`, data);
}

export const getCategoriesByCount = (data?: IGetJobsQuery) => {
  return Http.get(`jobs/cats-sum-by-jobs`, data);
}

export const getJobsByFav = (data?: IGetJobsQuery) => {
  return Http.get(`jobs/byFreelancerfav`, data);
}

export const getCurrentInterestJobs = (data?: IGetJobsQuery) => {
  return Http.get(`jobs/cur-interest`, data);
}

export const getCurrentInterestJobsByJobs = (data?: IGetJobsQuery) => {
  return Http.get(`jobs/cur-interest-jobs`, data);
}

export const getCurrentInterestJobsByTypes = (data?: IGetJobsQuery) => {
  return Http.get(`jobs/cur-interest-type`, data);
}

export const getTopInterestJobsByTypes = (data?: IGetJobsQuery) => {
  return Http.get(`jobs/top-interest-type`, data);
}
