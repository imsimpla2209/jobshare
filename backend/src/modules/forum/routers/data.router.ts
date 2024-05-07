/* eslint-disable import/prefer-default-export */
import express from 'express'
import { auth } from '@modules/auth'
import { ideasExcel, testQuery } from '../controllers/data.controller'
import { downloadFiles, getCLPresignedUrl, getPresignedUrl } from '../controllers/upload.controller'
import { sendTrigger } from '../controllers/sms.controller'
// import { getAuthToken, getAuthURL } from '../controllers/oAuth.controller'

export const dataRouter = express.Router()

// dataRouter.get('/oauth/url', getAuthURL)
// dataRouter.get('/oauth/token', auth(), getAuthToken)
dataRouter.get('/ideasExcel', ideasExcel)
dataRouter.get('/testQuery', testQuery)
dataRouter.get('/preSignUrl', auth(), getPresignedUrl)
dataRouter.post('/sendSMS', auth(), sendTrigger)
dataRouter.get('/preSignCLUrl', auth(), getCLPresignedUrl)
