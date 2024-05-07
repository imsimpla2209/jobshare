/* eslint-disable import/prefer-default-export */
import express from 'express'
import { auth } from '@modules/auth'
import { jobsExcel } from '../controllers/data.controller'
// import { getAuthToken, getAuthURL } from '../controllers/oAuth.controller'

export const dataRouter = express.Router()

// dataRouter.get('/oauth/url', getAuthURL)
// dataRouter.get('/oauth/token', auth(), getAuthToken)
dataRouter.get('/ideasExcel', jobsExcel)