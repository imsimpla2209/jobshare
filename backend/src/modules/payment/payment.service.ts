/* eslint-disable no-param-reassign */
/* eslint-disable operator-assignment */
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { getUserById } from '@modules/user/user.service'
import { EPaymentMethod } from 'common/enums'
import Payment from './payment.model'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { UpdatePaymentBody, IPaymentDoc, NewCreatedPayment } from './payment.interfaces'

/**
 * Register a payment
 * @param {NewCreatedPayment} paymentBody
 * @returns {Promise<IPaymentDoc>}
 */
export const createPayment = async (paymentBody: NewCreatedPayment): Promise<IPaymentDoc> => {
  // if (await Payment.isUserSigned(paymentBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Payment')
  // }
  return Payment.create(paymentBody)
}

/**
 * buy jobsPoints
 * @param {NewCreatedPayment} paymentBody
 * @param {number} jobsPoints
 * @param {mongoose.Types.ObjectId} buyer
 * @returns {Promise<IPaymentDoc>}
 */
export const buyJobsPoints = async (
  paymentBody: NewCreatedPayment,
  jobsPoints: number,
  buyer: mongoose.Types.ObjectId
): Promise<IPaymentDoc> => {
  const user = await getUserById(buyer)
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not found Buyer')
  }
  try {
    if (paymentBody.paymentMethod === EPaymentMethod.BALANCE) {
      if (!user?.balance || user?.balance < paymentBody?.amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Your balance is not enough')
      }
      user.balance = Number(user?.balance || 0) - paymentBody.amount
    }
    user.jobsPoints = Number(user?.jobsPoints || 0) + jobsPoints
    await user.save()
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot perform buying jobPoints ${error}`)
  }
  return Payment.create(paymentBody)
}

/**
 * Query for payments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryPayments = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  options.limit = 1000
  options.populate = 'from'
  const payments = await Payment.paginate(filter, options)
  return payments
}

/**
 * Get payment by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IPaymentDoc | null>}
 */
export const getPaymentById = async (id: mongoose.Types.ObjectId): Promise<IPaymentDoc | null> => Payment.findById(id)

/**
 * Get payment by paymentname
 * @param {string} paymentname
 * @returns {Promise<IPaymentDoc | null>}
 */
export const getPaymentByPaymentname = async (paymentname: string): Promise<IPaymentDoc | null> =>
  Payment.findOne({ paymentname })

/**
 * Get payment by email
 * @param {string} email
 * @returns {Promise<IPaymentDoc | null>}
 */
export const getPaymentByEmail = async (email: string): Promise<IPaymentDoc | null> => Payment.findOne({ email })

/**
 * Get payment by option
 * @param {object} options
 * @returns {Promise<IPaymentDoc | null>}
 */
export const getPaymentByOptions = async (Options: any): Promise<IPaymentDoc | null> => Payment.findOne(Options)

/**
 * Update payment by id
 * @param {mongoose.Types.ObjectId} paymentId
 * @param {UpdatePaymentBody} updateBody
 * @returns {Promise<IPaymentDoc | null>}
 */
export const updatePaymentById = async (
  paymentId: mongoose.Types.ObjectId,
  updateBody: UpdatePaymentBody
): Promise<IPaymentDoc | null> => {
  const payment = await getPaymentById(paymentId)
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found')
  }
  Object.assign(payment, updateBody)
  await payment.save()
  return payment
}

/**
 * Delete payment by id
 * @param {mongoose.Types.ObjectId} paymentId
 * @returns {Promise<IPaymentDoc | null>}
 */
export const deletePaymentById = async (paymentId: mongoose.Types.ObjectId): Promise<IPaymentDoc | null> => {
  const payment = await getPaymentById(paymentId)
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found')
  }
  await payment.deleteOne()
  return payment
}
