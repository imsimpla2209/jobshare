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
import freelancer from './freelancer.model'
import { NewRegisteredFreelancer } from './freelancer.interfaces'

setupTestDB()

const password = 'password1'
const salt = bcrypt.genSaltSync(8)
const hashedPassword = bcrypt.hashSync(password, salt)
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
}

const userTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
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

const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS)
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS)

const insertfreelancers = async (users: Record<string, any>[]) => {
  await freelancer.insertMany(users.map(user => ({ ...user, password: hashedPassword })))
}

describe('freelancer routes', () => {
  describe('POST /v1/users', () => {
    let newfreelancer: NewRegisteredFreelancer

    beforeEach(() => {
      // newfreelancer = {
      //   name: faker.name.findName(),
      //   email: faker.internet.email().toLowerCase(),
      //   password: 'password1',
      //   role: 'user',
      //   username: '420ppppp',
      //   isEmailVerified: false,
      //   phone: '',
      //   nationalId: '',
      //   dob: '',
      // }
    })

    // test('should return 201 and successfully create new user if data is ok', async () => {
    //   await insertfreelancers([admin])

    //   const res = await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newfreelancer)
    //     .expect(httpStatus.CREATED)

    //   expect(res.body).not.toHaveProperty('password')
    //   expect(res.body).toEqual({
    //     id: expect.anything(),
    //     name: newfreelancer.name,
    //     email: newfreelancer.email,
    //     role: newfreelancer.role,
    //     isEmailVerified: false,
    //   })

    //   const dbfreelancer = await freelancer.findById(res.body.id)
    //   expect(dbfreelancer).toBeDefined()
    //   if (!dbfreelancer) return

    //   expect(dbfreelancer.password).not.toBe(newfreelancer.password)
    //   expect(dbfreelancer).toMatchObject({
    //     name: newfreelancer.name,
    //     email: newfreelancer.email,
    //     role: newfreelancer.role,
    //     isEmailVerified: false,
    //   })
    // })

    // test('should be able to create an admin as well', async () => {
    //   await insertfreelancers([admin])
    //   newfreelancer.role = 'admin'

    //   const res = await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newfreelancer)
    //     .expect(httpStatus.CREATED)

    //   expect(res.body.role).toBe('admin')

    //   const dbfreelancer = await freelancer.findById(res.body.id)
    //   expect(dbfreelancer).toBeDefined()
    //   if (!dbfreelancer) return
    //   expect(dbfreelancer.role).toBe('admin')
    // })

    // test('should return 401 error if access token is missing', async () => {
    //   await request(app).post('/v1/users').send(newfreelancer).expect(httpStatus.UNAUTHORIZED)
    // })

    // test('should return 403 error if logged in user is not admin', async () => {
    //   await insertfreelancers([userOne])

    //   await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${userOneAccessToken}`)
    //     .send(newfreelancer)
    //     .expect(httpStatus.FORBIDDEN)
    // })

    // test('should return 400 error if email is invalid', async () => {
    //   await insertfreelancers([admin])
    //   newfreelancer.email = 'invalidEmail'

    //   await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newfreelancer)
    //     .expect(httpStatus.BAD_REQUEST)
    // })

    // test('should return 400 error if email is already used', async () => {
    //   await insertfreelancers([admin, userOne])
    //   newfreelancer.email = userOne.email

    //   await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newfreelancer)
    //     .expect(httpStatus.BAD_REQUEST)
    // })

    // test('should return 400 error if password length is less than 8 characters', async () => {
    //   await insertfreelancers([admin])
    //   newfreelancer.password = 'passwo1'

    //   await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newfreelancer)
    //     .expect(httpStatus.BAD_REQUEST)
    // })

    // test('should return 400 error if password does not contain both letters and numbers', async () => {
    //   await insertfreelancers([admin])
    //   newfreelancer.password = 'password'

    //   await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newfreelancer)
    //     .expect(httpStatus.BAD_REQUEST)

    //   newfreelancer.password = '1111111'

    //   await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newfreelancer)
    //     .expect(httpStatus.BAD_REQUEST)
    // })

    test('should return 400 error if role is neither user nor admin', async () => {
      await insertfreelancers([admin])
      ;(newfreelancer as any).role = 'invalid'

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newfreelancer)
        .expect(httpStatus.BAD_REQUEST)
    })
  })

  describe('GET /v1/users', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      const res = await request(app)
        .get('/v1/users')
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
        id: userOne._id.toHexString(),
        name: userOne.name,
        email: userOne.email,
        role: userOne.role,
        isEmailVerified: userOne.isEmailVerified,
      })
    })

    test('should return 401 if access token is missing', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      await request(app).get('/v1/users').send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if a non-admin is trying to access all users', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should correctly apply filter on name field', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      const res = await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: userOne.name })
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
      expect(res.body.results[0].id).toBe(userOne._id.toHexString())
    })

    test('should correctly apply filter on role field', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      const res = await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: 'user' })
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
      expect(res.body.results[0].id).toBe(userOne._id.toHexString())
      expect(res.body.results[1].id).toBe(userTwo._id.toHexString())
    })

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      const res = await request(app)
        .get('/v1/users')
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
      expect(res.body.results[0].id).toBe(userOne._id.toHexString())
      expect(res.body.results[1].id).toBe(userTwo._id.toHexString())
      expect(res.body.results[2].id).toBe(admin._id.toHexString())
    })

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      const res = await request(app)
        .get('/v1/users')
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
      expect(res.body.results[1].id).toBe(userOne._id.toHexString())
      expect(res.body.results[2].id).toBe(userTwo._id.toHexString())
    })

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      const res = await request(app)
        .get('/v1/users')
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

      const expectedOrder = [userOne, userTwo, admin].sort((a, b) => {
        if (a.role! < b.role!) {
          return 1
        }
        if (a.role! > b.role!) {
          return -1
        }
        return a.name < b.name ? -1 : 1
      })

      expectedOrder.forEach((user, index) => {
        expect(res.body.results[index].id).toBe(user._id.toHexString())
      })
    })

    test('should limit returned array if limit param is specified', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      const res = await request(app)
        .get('/v1/users')
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
      expect(res.body.results[0].id).toBe(userOne._id.toHexString())
      expect(res.body.results[1].id).toBe(userTwo._id.toHexString())
    })

    test('should return the correct page if page and limit params are specified', async () => {
      await insertfreelancers([userOne, userTwo, admin])

      const res = await request(app)
        .get('/v1/users')
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

  describe('GET /v1/users/:id', () => {
    test('should return 200 and the user object if data is ok', async () => {
      await insertfreelancers([userOne])

      const res = await request(app)
        .get(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: userOne._id.toHexString(),
        email: userOne.email,
        name: userOne.name,
        role: userOne.role,
        isEmailVerified: userOne.isEmailVerified,
      })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertfreelancers([userOne])

      await request(app).get(`/v1/users/${userOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if user is trying to get another user', async () => {
      await insertfreelancers([userOne, userTwo])

      await request(app)
        .get(`/v1/users/${userTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and the user object if admin is trying to get another user', async () => {
      await insertfreelancers([userOne, admin])

      await request(app)
        .get(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertfreelancers([admin])

      await request(app)
        .get('/v1/users/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if user is not found', async () => {
      await insertfreelancers([admin])

      await request(app)
        .get(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('DELETE /v1/users/:id', () => {
    test('should return 204 if data is ok', async () => {
      await insertfreelancers([userOne])

      await request(app)
        .delete(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)

      const dbfreelancer = await freelancer.findById(userOne._id)
      expect(dbfreelancer).toBeNull()
    })

    test('should return 401 error if access token is missing', async () => {
      await insertfreelancers([userOne])

      await request(app).delete(`/v1/users/${userOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if user is trying to delete another user', async () => {
      await insertfreelancers([userOne, userTwo])

      await request(app)
        .delete(`/v1/users/${userTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 204 if admin is trying to delete another user', async () => {
      await insertfreelancers([userOne, admin])

      await request(app)
        .delete(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertfreelancers([admin])

      await request(app)
        .delete('/v1/users/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if user already is not found', async () => {
      await insertfreelancers([admin])

      await request(app)
        .delete(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('PATCH /v1/users/:id', () => {
    test('should return 200 and successfully update user if data is ok', async () => {
      await insertfreelancers([userOne])
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      }

      const res = await request(app)
        .patch(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: userOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'user',
        isEmailVerified: false,
      })

      const dbfreelancer = await freelancer.findById(userOne._id)
      expect(dbfreelancer).toBeDefined()
      if (!dbfreelancer) return
      // expect(dbfreelancer.password).not.toBe(updateBody.password)
      expect(dbfreelancer).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'user' })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertfreelancers([userOne])
      const updateBody = { name: faker.name.findName() }

      await request(app).patch(`/v1/users/${userOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if user is updating another user', async () => {
      await insertfreelancers([userOne, userTwo])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/users/${userTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and successfully update user if admin is updating another user', async () => {
      await insertfreelancers([userOne, admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 404 if admin is updating another user that is not found', async () => {
      await insertfreelancers([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertfreelancers([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/users/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is invalid', async () => {
      await insertfreelancers([userOne])
      const updateBody = { email: 'invalidEmail' }

      await request(app)
        .patch(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is already taken', async () => {
      await insertfreelancers([userOne, userTwo])
      const updateBody = { email: userTwo.email }

      await request(app)
        .patch(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should not return 400 if email is my email', async () => {
      await insertfreelancers([userOne])
      const updateBody = { email: userOne.email }

      await request(app)
        .patch(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertfreelancers([userOne])
      const updateBody = { password: 'passwo1' }

      await request(app)
        .patch(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertfreelancers([userOne])
      const updateBody = { password: 'password' }

      await request(app)
        .patch(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)

      updateBody.password = '11111111'

      await request(app)
        .patch(`/v1/users/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })
  })
})
