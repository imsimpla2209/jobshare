import mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import httpStatus from 'http-status'
import moment from 'moment'
import config from '../../config/config'
import tokenTypes from '../token/token.types'
import * as tokenService from '../token/token.service'
import app from '../../app'
import setupTestDB from '../../common/jest/setupTestDB'
import Payment from './payment.model'
import { NewCreatedPayment } from './payment.interfaces'

setupTestDB()

const password = 'password1'
const salt = bcrypt.genSaltSync(8)
const hashedPassword = bcrypt.hashSync(password, salt)
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')

const paymentOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'payment',
  isEmailVerified: false,
}

const paymentTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'payment',
  isEmailVerified: false,
}

const admin = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
}

const paymentOneAccessToken = tokenService.generateToken(paymentOne._id, accessTokenExpires, tokenTypes.ACCESS)
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS)

const insertPayments = async (payments: Record<string, any>[]) => {
  await Payment.insertMany(payments.map(payment => ({ ...payment, password: hashedPassword })))
}

describe('Payment routes', () => {
  // describe('POST /v1/payments', () => {
  //   let newPayment: NewCreatedPayment

  //   beforeEach(() => {
  //     newPayment = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'payment',
  //       paymentname: '420ppppp',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should return 201 and successfully create new payment if data is ok', async () => {
  //     await insertPayments([admin])

  //     const res = await request(app)
  //       .post('/v1/payments')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newPayment)
  //       .expect(httpStatus.CREATED)

  //     expect(res.body).not.toHaveProperty('password')
  //     expect(res.body).toEqual({
  //       id: expect.anything(),
  //       name: newPayment.name,
  //       email: newPayment.email,
  //       role: newPayment.role,
  //       isEmailVerified: false,
  //     })

  //     const dbPayment = await Payment.findById(res.body.id)
  //     expect(dbPayment).toBeDefined()
  //     if (!dbPayment) return

  //     expect(dbPayment.password).not.toBe(newPayment.password)
  //     expect(dbPayment).toMatchObject({
  //       name: newPayment.name,
  //       email: newPayment.email,
  //       role: newPayment.role,
  //       isEmailVerified: false,
  //     })
  //   })

  //   test('should be able to create an admin as well', async () => {
  //     await insertPayments([admin])
  //     newPayment.role = 'admin'

  //     const res = await request(app)
  //       .post('/v1/payments')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newPayment)
  //       .expect(httpStatus.CREATED)

  //     expect(res.body.role).toBe('admin')

  //     const dbPayment = await Payment.findById(res.body.id)
  //     expect(dbPayment).toBeDefined()
  //     if (!dbPayment) return
  //     expect(dbPayment.role).toBe('admin')
  //   })

  //   test('should return 401 error if access token is missing', async () => {
  //     await request(app).post('/v1/payments').send(newPayment).expect(httpStatus.UNAUTHORIZED)
  //   })

  //   test('should return 403 error if logged in payment is not admin', async () => {
  //     await insertPayments([paymentOne])

  //     await request(app)
  //       .post('/v1/payments')
  //       .set('Authorization', `Bearer ${paymentOneAccessToken}`)
  //       .send(newPayment)
  //       .expect(httpStatus.FORBIDDEN)
  //   })

  //   test('should return 400 error if email is invalid', async () => {
  //     await insertPayments([admin])
  //     newPayment.email = 'invalidEmail'

  //     await request(app)
  //       .post('/v1/payments')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newPayment)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if email is already used', async () => {
  //     await insertPayments([admin, paymentOne])
  //     newPayment.email = paymentOne.email

  //     await request(app)
  //       .post('/v1/payments')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newPayment)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if password length is less than 8 characters', async () => {
  //     await insertPayments([admin])
  //     newPayment.password = 'passwo1'

  //     await request(app)
  //       .post('/v1/payments')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newPayment)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if password does not contain both letters and numbers', async () => {
  //     await insertPayments([admin])
  //     newPayment.password = 'password'

  //     await request(app)
  //       .post('/v1/payments')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newPayment)
  //       .expect(httpStatus.BAD_REQUEST)

  //     newPayment.password = '1111111'

  //     await request(app)
  //       .post('/v1/payments')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newPayment)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if role is neither payment nor admin', async () => {
  //     await insertPayments([admin])
  //     ;(newPayment as any).role = 'invalid'

  //     await request(app)
  //       .post('/v1/payments')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newPayment)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })
  // })

  describe('GET /v1/payments', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      const res = await request(app)
        .get('/v1/payments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      })
      expect(res.body.results).toHaveLength(3)
      expect(res.body.results[0]).toEqual({
        id: paymentOne._id.toHexString(),
        name: paymentOne.name,
        email: paymentOne.email,
        role: paymentOne.role,
        isEmailVerified: paymentOne.isEmailVerified,
      })
    })

    test('should return 401 if access token is missing', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      await request(app).get('/v1/payments').send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if a non-admin is trying to access all payments', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      await request(app)
        .get('/v1/payments')
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should correctly apply filter on name field', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      const res = await request(app)
        .get('/v1/payments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: paymentOne.name })
        .send()
        .expect(httpStatus.OK)

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      })
      expect(res.body.results).toHaveLength(1)
      expect(res.body.results[0].id).toBe(paymentOne._id.toHexString())
    })

    test('should correctly apply filter on role field', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      const res = await request(app)
        .get('/v1/payments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: 'payment' })
        .send()
        .expect(httpStatus.OK)

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      })
      expect(res.body.results).toHaveLength(2)
      expect(res.body.results[0].id).toBe(paymentOne._id.toHexString())
      expect(res.body.results[1].id).toBe(paymentTwo._id.toHexString())
    })

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      const res = await request(app)
        .get('/v1/payments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:desc' })
        .send()
        .expect(httpStatus.OK)

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      })
      expect(res.body.results).toHaveLength(3)
      expect(res.body.results[0].id).toBe(paymentOne._id.toHexString())
      expect(res.body.results[1].id).toBe(paymentTwo._id.toHexString())
      expect(res.body.results[2].id).toBe(admin._id.toHexString())
    })

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      const res = await request(app)
        .get('/v1/payments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:asc' })
        .send()
        .expect(httpStatus.OK)

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      })
      expect(res.body.results).toHaveLength(3)
      expect(res.body.results[0].id).toBe(admin._id.toHexString())
      expect(res.body.results[1].id).toBe(paymentOne._id.toHexString())
      expect(res.body.results[2].id).toBe(paymentTwo._id.toHexString())
    })

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      const res = await request(app)
        .get('/v1/payments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:desc,name:asc' })
        .send()
        .expect(httpStatus.OK)

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      })
      expect(res.body.results).toHaveLength(3)

      const expectedOrder = [paymentOne, paymentTwo, admin].sort((a, b) => {
        if (a.role! < b.role!) {
          return 1
        }
        if (a.role! > b.role!) {
          return -1
        }
        return a.name < b.name ? -1 : 1
      })

      expectedOrder.forEach((payment, index) => {
        expect(res.body.results[index].id).toBe(payment._id.toHexString())
      })
    })

    test('should limit returned array if limit param is specified', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      const res = await request(app)
        .get('/v1/payments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 2 })
        .send()
        .expect(httpStatus.OK)

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      })
      expect(res.body.results).toHaveLength(2)
      expect(res.body.results[0].id).toBe(paymentOne._id.toHexString())
      expect(res.body.results[1].id).toBe(paymentTwo._id.toHexString())
    })

    test('should return the correct page if page and limit params are specified', async () => {
      await insertPayments([paymentOne, paymentTwo, admin])

      const res = await request(app)
        .get('/v1/payments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 2, limit: 2 })
        .send()
        .expect(httpStatus.OK)

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      })
      expect(res.body.results).toHaveLength(1)
      expect(res.body.results[0].id).toBe(admin._id.toHexString())
    })
  })

  describe('GET /v1/payments/:id', () => {
    test('should return 200 and the payment object if data is ok', async () => {
      await insertPayments([paymentOne])

      const res = await request(app)
        .get(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: paymentOne._id.toHexString(),
        email: paymentOne.email,
        name: paymentOne.name,
        role: paymentOne.role,
        isEmailVerified: paymentOne.isEmailVerified,
      })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertPayments([paymentOne])

      await request(app).get(`/v1/payments/${paymentOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if payment is trying to get another payment', async () => {
      await insertPayments([paymentOne, paymentTwo])

      await request(app)
        .get(`/v1/payments/${paymentTwo._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and the payment object if admin is trying to get another payment', async () => {
      await insertPayments([paymentOne, admin])

      await request(app)
        .get(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertPayments([admin])

      await request(app)
        .get('/v1/payments/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if payment is not found', async () => {
      await insertPayments([admin])

      await request(app)
        .get(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('DELETE /v1/payments/:id', () => {
    test('should return 204 if data is ok', async () => {
      await insertPayments([paymentOne])

      await request(app)
        .delete(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)

      const dbPayment = await Payment.findById(paymentOne._id)
      expect(dbPayment).toBeNull()
    })

    test('should return 401 error if access token is missing', async () => {
      await insertPayments([paymentOne])

      await request(app).delete(`/v1/payments/${paymentOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if payment is trying to delete another payment', async () => {
      await insertPayments([paymentOne, paymentTwo])

      await request(app)
        .delete(`/v1/payments/${paymentTwo._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 204 if admin is trying to delete another payment', async () => {
      await insertPayments([paymentOne, admin])

      await request(app)
        .delete(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertPayments([admin])

      await request(app)
        .delete('/v1/payments/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if payment already is not found', async () => {
      await insertPayments([admin])

      await request(app)
        .delete(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('PATCH /v1/payments/:id', () => {
    test('should return 200 and successfully update payment if data is ok', async () => {
      await insertPayments([paymentOne])
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      }

      const res = await request(app)
        .patch(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: paymentOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'payment',
        isEmailVerified: false,
      })

      const dbPayment = await Payment.findById(paymentOne._id)
      expect(dbPayment).toBeDefined()
      if (!dbPayment) return
      // expect(dbPayment.password).not.toBe(updateBody.password)
      expect(dbPayment).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'payment' })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertPayments([paymentOne])
      const updateBody = { name: faker.name.findName() }

      await request(app).patch(`/v1/payments/${paymentOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if payment is updating another payment', async () => {
      await insertPayments([paymentOne, paymentTwo])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/payments/${paymentTwo._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and successfully update payment if admin is updating another payment', async () => {
      await insertPayments([paymentOne, admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 404 if admin is updating another payment that is not found', async () => {
      await insertPayments([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertPayments([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/payments/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is invalid', async () => {
      await insertPayments([paymentOne])
      const updateBody = { email: 'invalidEmail' }

      await request(app)
        .patch(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is already taken', async () => {
      await insertPayments([paymentOne, paymentTwo])
      const updateBody = { email: paymentTwo.email }

      await request(app)
        .patch(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should not return 400 if email is my email', async () => {
      await insertPayments([paymentOne])
      const updateBody = { email: paymentOne.email }

      await request(app)
        .patch(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertPayments([paymentOne])
      const updateBody = { password: 'passwo1' }

      await request(app)
        .patch(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertPayments([paymentOne])
      const updateBody = { password: 'password' }

      await request(app)
        .patch(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)

      updateBody.password = '11111111'

      await request(app)
        .patch(`/v1/payments/${paymentOne._id}`)
        .set('Authorization', `Bearer ${paymentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })
  })
})
