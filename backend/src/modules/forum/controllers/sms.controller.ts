/* eslint-disable no-console */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable import/prefer-default-export */
import config from '@config/config'
import axios from 'axios'
import { ApiError } from 'common/errors'
import httpStatus from 'http-status'

const sendSMS = async function (phones, content, type = 5) {
  const url = 'https://api.speedsms.vn/index.php/sms/send'
  const params = {
    to: phones,
    content,
    sms_type: type,
    sender: config.SMS.deviceId,
  }

  try {
    const response: any = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${config.SMS.accessKey}:x`).toString('base64')}`,
      },
    })

    if (response.data.status === 'success') {
      console.log('send sms success')
      return response.data
    }
    throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong when sending sms: ${response.data}`)
  } catch (error: any) {
    console.log(`send sms failed: ${error.message}`)
  }
}

const sendTrigger = async (req: any, res: any) => {
  try {
    const { phones, content } = req?.body
    const sent = await sendSMS([phones], content, 5)

    res.send(sent)
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong: ${error.message}`)
  }
}

export { sendSMS, sendTrigger }
