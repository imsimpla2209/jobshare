import { Freelancer } from '@modules/freelancer'
import { getFreelancerByOptions, getTopCurrentTypeTracking } from '@modules/freelancer/freelancer.service'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions } from '../../providers/paginate/paginate'
import catchAsync from '../../utils/catchAsync'
import pick from '../../utils/pick'
import Job, { JobCategory } from './job.model'
import * as jobService from './job.service'
import categoryService from './sub_services/jobCategory.service'
import { Skill } from '@modules/skill'

export const createJob = catchAsync(async (req: Request, res: Response) => {
  const job = await jobService.createJob(req.body)
  console.log('😘job', job)
  res.status(httpStatus.CREATED).send(job)
})

export const getJobs = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'skills', 'categories', 'client', 'searchText', 'currentStatus'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await getFreelancerByOptions({ user: new mongoose.Types.ObjectId(req?.user?._id as string) })
  const result = await jobService.queryJobs(filter, options, freelancer)
  res.send(result)
})

export const getAllJobsforAdmin = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'skills', 'categories', 'client'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await jobService.getAllJobs(filter, options)
  res.send(result)
})

export const getAdvancedJobs = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.body, [
    'duration',
    'complexity',
    'locations',
    'nOEmployee',
    'title',
    'budget',
    'paymentType',
    'paymentAmount',
    'description',
    'skills',
    'proposals',
    'categories',
    'tags',
    'currentStatus',
    'duration',
    'jobDuration',
    'type',
  ])
  const freelancer = await getFreelancerByOptions({ user: new mongoose.Types.ObjectId(req?.user?._id as string) })
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await jobService.queryAdvancedJobs(filter, options, req?.body?.searchText, freelancer)
  res.send(result)
})

export const searchJobs = catchAsync(async (req: Request, res: Response) => {
  const { searchText } = req.body
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await getFreelancerByOptions({ user: new mongoose.Types.ObjectId(req?.user?._id as string) })
  const result = await jobService.searchJobsByText(searchText, options, freelancer)
  res.send(result)
})

export const getRcmdJobs = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await getFreelancerByOptions({ user: new mongoose.Types.ObjectId(req?.user?._id as string) })
  const result = await jobService.getRcmdJob(
    req?.query?.freelancerId ? new mongoose.Types.ObjectId(req.query.freelancerId as string) : freelancer?._id,
    req.query.categories,
    req.query.skills,
    options,
    freelancer
  )
  res.send(result)
})

export const getJobByFreelancerFav = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await Freelancer.findOne({ user: new mongoose.Types.ObjectId(req?.user?._id as string) })
    .populate('favoriteJobs')
    .lean()
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const result = await jobService.getJobByFreelancerFav(freelancer, options)
  res.send(result)
})

export const getFavJobsByUser = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await jobService.getFavJobByFreelancer(
    new mongoose.Types.ObjectId(req.query.freelancerId as string),
    options
  )
  res.send(result)
})

export const getCurrentInterestedJobs = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await Freelancer.findOne({ user: new mongoose.Types.ObjectId(req?.user?._id as string) }).lean()
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const result = await jobService.getCurrentInterestedJobs(freelancer, options)
  res.send(result)
})

export const getCurrentInterestedJobsByType = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await Freelancer.findOne({ user: new mongoose.Types.ObjectId(req?.user?._id as string) }).lean()
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const result = await jobService.getCurrentInterestedJobsByType(freelancer, options)
  res.send(result)
})

export const getTopInterestedJobsByType = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await Freelancer.findOne({ user: new mongoose.Types.ObjectId(req?.user?._id as string) }).lean()
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const result = await jobService.getTopInterestedJobsByType(freelancer, options)
  res.send(result)
})

export const getCurrentInterestedJobsByJobs = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await Freelancer.findOne({ user: new mongoose.Types.ObjectId(req?.user?._id as string) }).lean()
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const result = await jobService.getCurrentInterestedJobsByJobs(freelancer, options)
  res.send(result)
})

export const getSimilarJobs = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const freelancer = await getFreelancerByOptions({ user: new mongoose.Types.ObjectId(req?.user?._id as string) })
  const result = await jobService.getSimilarJobs(
    new mongoose.Types.ObjectId(req.query.id as string),
    options,
    freelancer
  )
  res.send(result)
})

export const getJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const job = await jobService.getJobById(new mongoose.Types.ObjectId(req.params.id))
    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
    }
    res.send(job)
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No job id was sent')
  }
})

export const updateJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const job = await jobService.updateJobById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(job)
  }
})

export const updateJobStatus = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const job = await jobService.changeStatusJobById(
      new mongoose.Types.ObjectId(req.params.id),
      req.body?.status,
      req.body?.comment
    )
    res.send(job)
  }
})

export const forcedDeleteJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await jobService.deleteJobById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const deleteJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await jobService.softDeleteJobById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

// export const updateMulJobs = catchAsync(async (req: Request, res: Response) => {
//   if (typeof req.params?.id === 'string') {
//     await jobService.softDeleteJobById(new mongoose.Types.ObjectId(req.params.id))
//     res.status(httpStatus.NO_CONTENT).send()
//   }
// })

export const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const result = await jobService.getAllJob()
  res.send(result)
})

// ================================Categories Controller================================= //

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await categoryService.getAll(options?.limit)
  res.send(result)
})

export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories()
  res.send(result)
})

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const skill = await categoryService.createCategory(req.body)
  res.status(httpStatus.CREATED).send(skill)
})

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const skill = await categoryService.updateCategoryById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(skill)
  }
})

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await categoryService.deleteCategoryById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

// ================================GroupBy Controller================================= //
export const sumBySkills = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])

  const skillGroup = await Job.aggregate([
    {
      $match: {
        isDeleted: { $exists: false },
        reqSkills: { $exists: true, $ne: [] },
      },
    },
    // Unwind reqSkills array
    { $unwind: '$reqSkills' },
    {
      $group: {
        _id: '$reqSkills.skill',
        count: { $sum: 1 }, // Count occurrences of each skill
        // data: { $push: "$$ROOT" } // Store entire documents for each skill
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: options?.limit || 12,
    },
  ])

  const sumBySkill = await Skill.populate(skillGroup, [{ path: '_id' }])

  res.status(httpStatus.OK).send(sumBySkill)
})

export const sumByCats = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])

  const catsGroup = await Job.aggregate([
    {
      $match: {
        isDeleted: { $exists: false },
        categories: { $exists: true, $ne: [] },
      },
    },
    // Unwind reqSkills array
    { $unwind: '$categories' },
    {
      $group: {
        _id: '$categories',
        count: { $sum: 1 }, // Count occurrences of each skill
        // data: { $push: "$$ROOT" } // Store entire documents for each skill
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: options?.limit || 11,
    },
  ])

  const sumByCats = await JobCategory.populate(catsGroup, [{ path: '_id' }])

  res.status(httpStatus.OK).send(sumByCats)
})
