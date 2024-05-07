/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/prefer-default-export */
import config from '@config/config'
import { auth } from '@modules/auth'
import { startBackup } from '@modules/forum/utils/backup'
import { Connect, Process } from '@modules/forum/utils/mongodb'
import { userValidation } from '@modules/user'
import { changeActiveUser } from '@modules/user/user.controller'
import express from 'express'
import { validate } from 'providers/validate'
import { verifyJob } from '@modules/job/job.service'
import mongoose from 'mongoose'
import { createNotifyforAll } from '@modules/notify/notify.service'
import { FEMessage } from 'common/enums/constant'
import { ESocketEvent } from 'common/enums'
import App from '../models/app.model'
import { getAllUsers } from '../controllers/data.controller'
import {
  getAppInfo,
  getDashboardSummarize,
  getPaymentStats,
  getProjectStats,
  getUserSignUpStats,
  getUserSignUpStatsByMonth,
} from '../controllers/dashboard.controller'

export const adminRouter = express.Router()

adminRouter.get('/backup', auth('backup'), async (req, res) => {
  try {
    await startBackup()
    const slave = await Connect(config.mongoose.slave)

    const listDatabases = await slave.db('backup').admin().listDatabases()
    const listBackups = listDatabases.databases
      .filter(db => db.name.includes('jobsicker-version'))
      .sort((a, b) => Number(b.name.split('jobsicker-version-')?.[1]) - Number(a.name.split('jobsicker-version-')?.[1]))

    if (listBackups.length > 5) {
      const backup_db = slave.db(listBackups[listBackups.length - 1].name)
      const collections = await Promise.all((await backup_db.listCollections().toArray()).map(el => el.name))

      for (const collection of collections) {
        await backup_db.dropCollection(collection)
      }
    }
    slave.close()
    res.status(200).json({
      success: true,
      message: 'Backup data is successful',
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    })
  }
})

adminRouter.post('/restore', auth('backup'), async (req, res) => {
  try {
    const { name } = req.body

    const { log } = console
    console.log = function (...args) {
      args.unshift(new Date())
      log.apply(console, args)
    }
    /** *********************************************************************** */
    console.log(config)
    /** *********************************************************************** */
    const primary = await Connect(config.mongoose.url)
    const database = primary.db(`test`)
    console.log(`Connect db primary....`)
    const slave = await Connect(config.mongoose.slave)
    const backup_db = slave.db(name)

    console.log(`Connect db slave....`)
    /** *********************************************************************** */
    const total = await Process(backup_db, database)
    console.log(`${total} documents backup done...`)
    await primary.close()
    await slave.close()

    res.status(200).json({
      success: true,
      message: 'Restore data is successful',
    })
  } catch (err: any) {
    res.status(400).json({
      success: true,
      message: err.message,
    })
  }
})

adminRouter.post('/drop', auth('backup'), async (req, res) => {
  try {
    const { name } = req.body
    const slave = await Connect(config.mongoose.slave)

    const backup_db = slave.db(name)
    const collections = await Promise.all((await backup_db.listCollections().toArray()).map(el => el.name))

    for (const collection of collections) {
      await backup_db.dropCollection(collection)
    }

    slave.close()
    res.status(200).json({
      success: true,
      message: 'Deleted old version of database successfully',
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    })
  }
})

adminRouter.get('/all-backup', auth('backup'), async (req, res) => {
  try {
    const slave = await Connect(config.mongoose.slave)

    const listDatabases = await slave.db('backup').admin().listDatabases()
    console.log('😘', listDatabases)
    const listBackups = listDatabases.databases
      .filter(db => db.name.includes('jobsicker-version'))
      .sort((a, b) => Number(b.name.split('jobsicker-version-')?.[1]) - Number(a.name.split('jobsicker-version-')?.[1]))
    res.status(200).json({
      success: true,
      data: listBackups,
    })
  } catch (err) {
    console.log('err')
    res.status(400).json({
      success: false,
    })
  }
})

adminRouter.get('/userStatsByDay', auth('manageUsers'), getUserSignUpStats)
adminRouter.post('/userStats', auth('manageUsers'), getUserSignUpStatsByMonth)
adminRouter.post('/jobStats', auth('dashboard'), getProjectStats)
adminRouter.get('/summarizeStats', auth('dashboard'), getDashboardSummarize)
adminRouter.get('/yearPaymentStats', auth('dashboard'), getPaymentStats)
adminRouter.get('/getUsers', auth('manageUsers'), getAllUsers)
adminRouter.patch('/changeActiveUser/:userId', auth('manageUsers'), validate(userValidation.getUser), changeActiveUser)

adminRouter.get('/app-info', async (req, res) => {
  try {
    const data = await getAppInfo()
    delete data._id
    delete data.__v
    delete data['updatedAt']
    delete data['createdAt']
    if (!data) {
      const newAppInfo = await App.create({})
      delete newAppInfo._id
      delete newAppInfo.__v
      delete newAppInfo['updatedAt']
      delete newAppInfo['createdAt']
      res.status(200).send(newAppInfo)
    } else {
      res.status(200).send(data)
    }
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    })
  }
})

adminRouter.patch('/app-info', auth('dashboard'), express.json(), async (req, res) => {
  try {
    await App.updateMany({}, req.body, { upsert: true })
    createNotifyforAll(
      {
        path: '/buyconnects',
        content: FEMessage().jobsPointsChange,
        to: undefined,
      },
      ESocketEvent.SICKSETTING
    )
    res.status(200).json({ success: 1 })
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    })
  }
})

adminRouter.patch('/verify-job/:jobId', auth('manageContents'), express.json(), async (req, res) => {
  try {
    await verifyJob(new mongoose.Types.ObjectId(req.params.jobId))
    res.status(200).json({ message: 'Successfully verified' })
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    })
  }
})
