/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import express from 'express'
import { auth } from '@modules/auth'
import Queue from 'bull'
import { logger } from 'common/logger'
import { ApiError } from 'common/errors'
import httpStatus from 'http-status'
import { senVerification, sendVerificationEmailFunc } from '../utils/mailer'
import { getPresignedUrl, getCLPresignedUrl } from '../controllers/upload.controller'
import { sendSMS, sendTrigger } from '../controllers/sms.controller'
import { testQuery } from '../controllers/data.controller'

export const testRouter = express.Router()

testRouter.get('/testQuery', testQuery)

testRouter.get('/testMail', async (req, res) => {
  const mailrs = await sendVerificationEmailFunc('iacokhactqt@gmail.com', '420ent', '22')
  res.status(200).end(JSON.stringify(mailrs))
})
testRouter.get('/testSms', async (req, res) => {
  const mailrs = await sendSMS(['0559372202'], '420ent', 5)
  res.status(200).send(mailrs)
})
testRouter.get('/testCL', auth(), getCLPresignedUrl)

export const testQueue = new Queue('test-queue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
})

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function delayExample() {
  console.log('Start')

  // Chờ đợi 2 giây
  await wait(5000)

  console.log('After 2 seconds')
}

testQueue.process(async job => {
  const { contractId, invitationId } = job.data

  try {
    // Gọi service để xử lý accept contract
    const result = await delayExample()
    return result
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Error processing contract job: ${error.message}`)
  }
})

testQueue.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed: ${result}`)
  return result
})

testQueue.isReady().then(() => {
  testQueue.resume()
})

testRouter.get('/testRedisQueue', async (req, res) => {
  const mailrs = await testQueue.add({ contractId: '123', invitationId: '123' })
  res.status(200).send(mailrs)
})
