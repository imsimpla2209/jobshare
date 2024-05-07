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
import Message from './message.model'
import { NewCreatedMessage } from './message.interfaces'

setupTestDB()

const password = 'password1'
const salt = bcrypt.genSaltSync(8)
const hashedPassword = bcrypt.hashSync(password, salt)
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')

const messageOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'message',
  isEmailVerified: false,
}

const messageTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'message',
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

const messageOneAccessToken = tokenService.generateToken(messageOne._id, accessTokenExpires, tokenTypes.ACCESS)
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS)

const insertMessages = async (messages: Record<string, any>[]) => {
  await Message.insertMany(messages.map(message => ({ ...message, password: hashedPassword })))
}

describe('Message routes', () => {
  // describe('POST /v1/messages', () => {
  //   let newMessage: NewCreatedMessage

  //   beforeEach(() => {
  //     newMessage = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'message',
  //       messagename: '420ppppp',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should return 201 and successfully create new message if data is ok', async () => {
  //     await insertMessages([admin])

  //     const res = await request(app)
  //       .post('/v1/messages')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newMessage)
  //       .expect(httpStatus.CREATED)

  //     expect(res.body).not.toHaveProperty('password')
  //     expect(res.body).toEqual({
  //       id: expect.anything(),
  //       name: newMessage.name,
  //       email: newMessage.email,
  //       role: newMessage.role,
  //       isEmailVerified: false,
  //     })

  //     const dbMessage = await Message.findById(res.body.id)
  //     expect(dbMessage).toBeDefined()
  //     if (!dbMessage) return

  //     expect(dbMessage.password).not.toBe(newMessage.password)
  //     expect(dbMessage).toMatchObject({
  //       name: newMessage.name,
  //       email: newMessage.email,
  //       role: newMessage.role,
  //       isEmailVerified: false,
  //     })
  //   })

  //   test('should be able to create an admin as well', async () => {
  //     await insertMessages([admin])
  //     newMessage.role = 'admin'

  //     const res = await request(app)
  //       .post('/v1/messages')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newMessage)
  //       .expect(httpStatus.CREATED)

  //     expect(res.body.role).toBe('admin')

  //     const dbMessage = await Message.findById(res.body.id)
  //     expect(dbMessage).toBeDefined()
  //     if (!dbMessage) return
  //     expect(dbMessage.role).toBe('admin')
  //   })

  //   test('should return 401 error if access token is missing', async () => {
  //     await request(app).post('/v1/messages').send(newMessage).expect(httpStatus.UNAUTHORIZED)
  //   })

  //   test('should return 403 error if logged in message is not admin', async () => {
  //     await insertMessages([messageOne])

  //     await request(app)
  //       .post('/v1/messages')
  //       .set('Authorization', `Bearer ${messageOneAccessToken}`)
  //       .send(newMessage)
  //       .expect(httpStatus.FORBIDDEN)
  //   })

  //   test('should return 400 error if email is invalid', async () => {
  //     await insertMessages([admin])
  //     newMessage.email = 'invalidEmail'

  //     await request(app)
  //       .post('/v1/messages')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newMessage)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if email is already used', async () => {
  //     await insertMessages([admin, messageOne])
  //     newMessage.email = messageOne.email

  //     await request(app)
  //       .post('/v1/messages')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newMessage)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if password length is less than 8 characters', async () => {
  //     await insertMessages([admin])
  //     newMessage.password = 'passwo1'

  //     await request(app)
  //       .post('/v1/messages')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newMessage)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if password does not contain both letters and numbers', async () => {
  //     await insertMessages([admin])
  //     newMessage.password = 'password'

  //     await request(app)
  //       .post('/v1/messages')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newMessage)
  //       .expect(httpStatus.BAD_REQUEST)

  //     newMessage.password = '1111111'

  //     await request(app)
  //       .post('/v1/messages')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newMessage)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if role is neither message nor admin', async () => {
  //     await insertMessages([admin])
  //     ;(newMessage as any).role = 'invalid'

  //     await request(app)
  //       .post('/v1/messages')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newMessage)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })
  // })

  describe('GET /v1/messages', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      const res = await request(app)
        .get('/v1/messages')
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
        id: messageOne._id.toHexString(),
        name: messageOne.name,
        email: messageOne.email,
        role: messageOne.role,
        isEmailVerified: messageOne.isEmailVerified,
      })
    })

    test('should return 401 if access token is missing', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      await request(app).get('/v1/messages').send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if a non-admin is trying to access all messages', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      await request(app)
        .get('/v1/messages')
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should correctly apply filter on name field', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      const res = await request(app)
        .get('/v1/messages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: messageOne.name })
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
      expect(res.body.results[0].id).toBe(messageOne._id.toHexString())
    })

    test('should correctly apply filter on role field', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      const res = await request(app)
        .get('/v1/messages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: 'message' })
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
      expect(res.body.results[0].id).toBe(messageOne._id.toHexString())
      expect(res.body.results[1].id).toBe(messageTwo._id.toHexString())
    })

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      const res = await request(app)
        .get('/v1/messages')
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
      expect(res.body.results[0].id).toBe(messageOne._id.toHexString())
      expect(res.body.results[1].id).toBe(messageTwo._id.toHexString())
      expect(res.body.results[2].id).toBe(admin._id.toHexString())
    })

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      const res = await request(app)
        .get('/v1/messages')
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
      expect(res.body.results[1].id).toBe(messageOne._id.toHexString())
      expect(res.body.results[2].id).toBe(messageTwo._id.toHexString())
    })

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      const res = await request(app)
        .get('/v1/messages')
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

      const expectedOrder = [messageOne, messageTwo, admin].sort((a, b) => {
        if (a.role! < b.role!) {
          return 1
        }
        if (a.role! > b.role!) {
          return -1
        }
        return a.name < b.name ? -1 : 1
      })

      expectedOrder.forEach((message, index) => {
        expect(res.body.results[index].id).toBe(message._id.toHexString())
      })
    })

    test('should limit returned array if limit param is specified', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      const res = await request(app)
        .get('/v1/messages')
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
      expect(res.body.results[0].id).toBe(messageOne._id.toHexString())
      expect(res.body.results[1].id).toBe(messageTwo._id.toHexString())
    })

    test('should return the correct page if page and limit params are specified', async () => {
      await insertMessages([messageOne, messageTwo, admin])

      const res = await request(app)
        .get('/v1/messages')
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

  describe('GET /v1/messages/:id', () => {
    test('should return 200 and the message object if data is ok', async () => {
      await insertMessages([messageOne])

      const res = await request(app)
        .get(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: messageOne._id.toHexString(),
        email: messageOne.email,
        name: messageOne.name,
        role: messageOne.role,
        isEmailVerified: messageOne.isEmailVerified,
      })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertMessages([messageOne])

      await request(app).get(`/v1/messages/${messageOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if message is trying to get another message', async () => {
      await insertMessages([messageOne, messageTwo])

      await request(app)
        .get(`/v1/messages/${messageTwo._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and the message object if admin is trying to get another message', async () => {
      await insertMessages([messageOne, admin])

      await request(app)
        .get(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertMessages([admin])

      await request(app)
        .get('/v1/messages/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if message is not found', async () => {
      await insertMessages([admin])

      await request(app)
        .get(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('DELETE /v1/messages/:id', () => {
    test('should return 204 if data is ok', async () => {
      await insertMessages([messageOne])

      await request(app)
        .delete(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)

      const dbMessage = await Message.findById(messageOne._id)
      expect(dbMessage).toBeNull()
    })

    test('should return 401 error if access token is missing', async () => {
      await insertMessages([messageOne])

      await request(app).delete(`/v1/messages/${messageOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if message is trying to delete another message', async () => {
      await insertMessages([messageOne, messageTwo])

      await request(app)
        .delete(`/v1/messages/${messageTwo._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 204 if admin is trying to delete another message', async () => {
      await insertMessages([messageOne, admin])

      await request(app)
        .delete(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertMessages([admin])

      await request(app)
        .delete('/v1/messages/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if message already is not found', async () => {
      await insertMessages([admin])

      await request(app)
        .delete(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('PATCH /v1/messages/:id', () => {
    test('should return 200 and successfully update message if data is ok', async () => {
      await insertMessages([messageOne])
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      }

      const res = await request(app)
        .patch(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: messageOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'message',
        isEmailVerified: false,
      })

      const dbMessage = await Message.findById(messageOne._id)
      expect(dbMessage).toBeDefined()
      if (!dbMessage) return
      // expect(dbMessage.password).not.toBe(updateBody.password)
      expect(dbMessage).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'message' })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertMessages([messageOne])
      const updateBody = { name: faker.name.findName() }

      await request(app).patch(`/v1/messages/${messageOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if message is updating another message', async () => {
      await insertMessages([messageOne, messageTwo])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/messages/${messageTwo._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and successfully update message if admin is updating another message', async () => {
      await insertMessages([messageOne, admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 404 if admin is updating another message that is not found', async () => {
      await insertMessages([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertMessages([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/messages/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is invalid', async () => {
      await insertMessages([messageOne])
      const updateBody = { email: 'invalidEmail' }

      await request(app)
        .patch(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is already taken', async () => {
      await insertMessages([messageOne, messageTwo])
      const updateBody = { email: messageTwo.email }

      await request(app)
        .patch(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should not return 400 if email is my email', async () => {
      await insertMessages([messageOne])
      const updateBody = { email: messageOne.email }

      await request(app)
        .patch(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertMessages([messageOne])
      const updateBody = { password: 'passwo1' }

      await request(app)
        .patch(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertMessages([messageOne])
      const updateBody = { password: 'password' }

      await request(app)
        .patch(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)

      updateBody.password = '11111111'

      await request(app)
        .patch(`/v1/messages/${messageOne._id}`)
        .set('Authorization', `Bearer ${messageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })
  })
})
