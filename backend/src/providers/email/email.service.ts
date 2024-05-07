import SibApiV3Sdk from 'sib-api-v3-sdk'
import config from '../../config/config'
import logger from '../../common/logger/logger'
import { Message, IReceiver } from './email.interfaces'

export const transport = async () => {
  const client = SibApiV3Sdk.ApiClient.instance

  const apiKey = client.authentications['api-key']
  apiKey.apiKey = config.email.sibKey

  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()
  return tranEmailApi
}

let sibTransport

if (config.env !== 'test') {
  sibTransport = transport()
    .then(tranEmailApi => {
      logger.info('Connected to email server')
      return tranEmailApi
    })
    .catch(() =>
      logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env')
    )
}

/**
 * Send an email
 * @param {IReceiver | IReceiver[]} to
 * @param {string} subject
 * @param {string} textContent
 * @param {string} htmlContent
 * @returns {Promise<void>}
 */
export const sendEmail = async (
  to: IReceiver | IReceiver[],
  subject: string,
  textContent: string,
  htmlContent: string
): Promise<void> => {
  const sender = {
    email: config.email.from,
    name: 'JobSicker420 Application',
  }
  const msg: Message = {
    from: sender,
    to,
    subject,
    textContent,
    htmlContent,
  }
  await sibTransport.sendTransacEmail(msg)
}

/**
 * Send reset password email
 * @param {IReceiver} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to: IReceiver, token: string): Promise<void> => {
  const subject = 'Reset password'
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://${config.clientUrl}/reset-password?token=${token}`
  const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`
  await sendEmail(to, subject, text, html)
}

/**
 * Send verification email
 * @param {IReceiver} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (to: IReceiver, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification'
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://${config.clientUrl}/verify-email?token=${token}`
  const text = `Hi ${name},
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`
  await sendEmail(to, subject, text, html)
}

/**
 * Send email verification after registration
 * @param {IReceiver} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendSuccessfulRegistration = async (to: IReceiver, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification'
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://${config.clientUrl}/verify-email?token=${token}`
  const text = `Hi ${name},
  Congratulations! Your account has been created. 
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`
  await sendEmail(to, subject, text, html)
}

/**
 * Send email verification after registration
 * @param {IReceiver} to
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendAccountCreated = async (to: IReceiver, name: string): Promise<void> => {
  const subject = 'Account Created Successfully'
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = `http://${config.clientUrl}/auth/login`
  const text = `Hi ${name},
  Congratulations! Your account has been created successfully. 
  You can now login at: ${loginUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created successfully.</p>
  <p>You can now login at: ${loginUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`
  await sendEmail(to, subject, text, html)
}
