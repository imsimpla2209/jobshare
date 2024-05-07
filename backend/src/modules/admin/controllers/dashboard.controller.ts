/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import Client from '@modules/client/client.model'
import { Freelancer } from '@modules/freelancer'
import { Job } from '@modules/job'
import { Payment } from '@modules/payment'
import { User } from '@modules/user'
import { EJobStatus, EStatus, EUserType } from 'common/enums'
import { ApiError } from 'common/errors'
import httpStatus from 'http-status'
import moment from 'moment'
import App from '../models/app.model'

export const getUserSignUpStats = async (req, res, next) => {
  try {
    const today = moment().startOf('day')
    const twoMonthsAgo = moment().subtract(2, 'months').startOf('day')

    const dateArray = []
    let currentDate = moment(twoMonthsAgo)
    while (currentDate <= today) {
      dateArray.push({
        createdAt: {
          $gte: moment(currentDate).toDate(),
          $lte: moment(currentDate).endOf('month').toDate(),
        },
      })
      currentDate = moment(currentDate).add(1, 'month')
    }

    const userStats = await User.aggregate([
      {
        $match: {
          $or: dateArray,
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
              },
            },
            type: '$lastLoginAs',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          totalUser: { $sum: '$count' },
          types: {
            $push: {
              type: '$_id.type',
              total: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalUser: 1,
          types: 1,
        },
      },
    ])

    // Create an object to hold results
    const result = {}

    // Fill the result object with the data and fill missing dates with zero
    let currentDateToCheck = moment(twoMonthsAgo)
    while (currentDateToCheck <= today) {
      const formattedDate = currentDateToCheck.format('YYYY-MM')
      const foundData = userStats.find(data => data.date === formattedDate)
      if (foundData) {
        result[formattedDate] = foundData
      } else {
        result[formattedDate] = {
          totalUser: 0,
          types: [
            {
              type: 'Client',
              total: 0,
            },
            {
              type: 'Freelancer',
              total: 0,
            },
          ],
          date: formattedDate,
        }
      }
      currentDateToCheck = currentDateToCheck.add(1, 'days')
    }

    // Convert the result object to an array
    const finalResult = Object.values(result)

    return res.status(200).json(finalResult)
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot get user sign Stats ${error}`)
  }
}

export const getUserSignUpStatsByMonth = async (req, res, next) => {
  try {
    const { startDate, endDate, timelineOption } = req.body
    const realEndDate = endDate || new Date()

    let timeline = []
    let currentDate = moment(startDate)

    if (timelineOption === 'daily') {
      while (currentDate <= moment(realEndDate)) {
        timeline.push(moment(currentDate).format('YYYY-MM-DD'))
        currentDate = moment(currentDate).add(1, 'day')
      }
    } else if (timelineOption === 'weekly') {
      // Use ISOWeek to specify date time
      const startWeek = moment(startDate).isoWeek()
      const endWeek = moment(realEndDate).isoWeek()
      for (let week = startWeek; week <= endWeek; week++) {
        timeline.push(`Week ${week}, ${moment(startDate).isoWeek(week).format('YYYY')}`)
      }
    } else if (timelineOption === 'monthly') {
      // Use ISOMonth to specify date time
      while (currentDate <= moment(realEndDate)) {
        timeline.push(moment(currentDate).startOf('month').format('YYYY-MM'))
        currentDate = moment(currentDate).add(1, 'month')
      }
    }

    const projectStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment(startDate).toDate(),
            $lte: moment(realEndDate).toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timelineOption === 'monthly' ? '%Y-%m' : timelineOption === 'weekly' ? 'Week %V, %Y' : '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          freelancer: { $sum: { $cond: [{ $eq: ['$lastLoginAs', EUserType.FREELANCER] }, 1, 0] } },
          client: { $sum: { $cond: [{ $eq: ['$lastLoginAs', EUserType.CLIENT] }, 1, 0] } },
        },
      },
    ])
    const statsByTimeline = timeline.map(date => {
      const foundStat = projectStats.find(stat => stat._id === date)
      if (!foundStat) {
        return {
          date,
          freelancer: 0,
          client: 0,
        }
      }

      return {
        date,
        ...foundStat,
      }
    })

    return res.status(200).json(statsByTimeline)
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot get Jobs Stats ${error}`)
  }
}

export const getProjectStats = async (req, res, next) => {
  try {
    const { startDate, endDate, timelineOption } = req.body
    const realEndDate = endDate || new Date()

    let timeline = []
    let currentDate = moment(startDate)

    if (timelineOption === 'daily') {
      while (currentDate <= moment(realEndDate)) {
        timeline.push(moment(currentDate).format('YYYY-MM-DD'))
        currentDate = moment(currentDate).add(1, 'day')
      }
    } else if (timelineOption === 'weekly') {
      // Use ISOWeek to specify date time
      const startWeek = moment(startDate).isoWeek()
      const endWeek = moment(realEndDate).isoWeek()
      for (let week = startWeek; week <= endWeek; week++) {
        timeline.push(`Week ${week}, ${moment(startDate).isoWeek(week).format('YYYY')}`)
      }
    } else if (timelineOption === 'monthly') {
      // Use ISOMonth to specify date time
      while (currentDate <= moment(realEndDate)) {
        timeline.push(moment(currentDate).startOf('month').format('YYYY-MM'))
        currentDate = moment(currentDate).add(1, 'month')
      }
    }

    const projectStats = await Job.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment(startDate).toDate(),
            $lte: moment(realEndDate).toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timelineOption === 'monthly' ? '%Y-%m' : timelineOption === 'weekly' ? 'Week %V, %Y' : '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          pendingJobs: { $sum: { $cond: [{ $eq: ['$currentStatus', EJobStatus.PENDING] }, 1, 0] } },
          wipJobs: { $sum: { $cond: [{ $eq: ['$currentStatus', EJobStatus.OPEN] }, 1, 0] } },
          doneJobs: { $sum: { $cond: [{ $eq: ['$currentStatus', EJobStatus.COMPLETED] }, 1, 0] } },
        },
      },
    ])
    const statsByTimeline = timeline.map(date => {
      const foundStat = projectStats.find(stat => stat._id === date)
      return {
        date,
        count: foundStat || { pendingJobs: 0, wipJobs: 0, doneJobs: 0 },
      }
    })

    return res.status(200).json(statsByTimeline)
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot get Jobs Stats ${error}`)
  }
}

export const getAppInfo = async () => {
  try {
    const data = await App.findOne({}).lean()
    if (!data) {
      const newAppInfo = await App.create({})
      return newAppInfo
    }
    return data
  } catch (err: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot get app Stats ${err}`)
  }
}

export const getDashboardSummarize = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalJobs = await Job.countDocuments()
    const totalFreelancers = await Freelancer.countDocuments()
    const totalClients = await Client.countDocuments()
    const totalCompletedJobs = await Job.find({ currentStatus: EStatus.COMPLETED }).countDocuments()
    const totalRevenue = await Payment.aggregate([
      { $match: {} },
      { $group: { _id: null, sum: { $sum: '$amount' } } },
      { $project: { _id: 0, sum: 1 } },
    ])
    return res.status(200).json({
      totalUsers,
      totalJobs,
      totalFreelancers,
      totalClients,
      totalCompletedJobs,
      totalRevenue: totalRevenue[0].sum,
    })
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot get Summarize')
  }
}

export const getPaymentStats = async (req, res) => {
  const currentDate = new Date()
  const lastYearDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth() + 1, 0)
  const currentYear = new Date().getFullYear()
  try {
    const result = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYearDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    const months = []
    for (let i = 1; i <= 12; i++) {
      const month = `${currentYear}-${i.toString().padStart(2, '0')}`
      const existingMonth = result.find(entry => entry._id === month)
      if (existingMonth) {
        months.push(existingMonth)
      } else {
        months.push({ _id: month, totalAmount: 0 })
      }
    }

    return res.status(200).json(months)
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot get Summarize')
  }
}
