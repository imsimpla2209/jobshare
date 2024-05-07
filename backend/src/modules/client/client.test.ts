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
import Client from './client.model'
import { NewRegisteredClient } from './client.interfaces'

setupTestDB()

const password = 'password1'
const salt = bcrypt.genSaltSync(8)
const hashedPassword = bcrypt.hashSync(password, salt)
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')

const clientOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'client',
  isEmailVerified: false,
}

const clientTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'client',
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

const clientOneAccessToken = tokenService.generateToken(clientOne._id, accessTokenExpires, tokenTypes.ACCESS)
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS)

const insertClients = async (clients: Record<string, any>[]) => {
  await Client.insertMany(clients.map(client => ({ ...client, password: hashedPassword })))
}

describe('Client routes', () => {
  describe('POST /v1/clients', () => {
    let newClient: NewRegisteredClient

    // beforeEach(() => {
    //   newClient = {
    //     name: faker.name.findName(),
    //     email: faker.internet.email().toLowerCase(),
    //     password: 'password1',
    //     role: 'client',
    //     clientname: '420ppppp',
    //     isEmailVerified: false,
    //     phone: '',
    //     nationalId: '',
    //     dob: '',
    //   }
    // })

    // test('should return 201 and successfully create new client if data is ok', async () => {
    //   await insertClients([admin])

    //   const res = await request(app)
    //     .post('/v1/clients')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newClient)
    //     .expect(httpStatus.CREATED)

    //   expect(res.body).not.toHaveProperty('password')
    //   expect(res.body).toEqual({
    //     id: expect.anything(),
    //     name: newClient.name,
    //     email: newClient.email,
    //     role: newClient.role,
    //     isEmailVerified: false,
    //   })

    //   const dbClient = await Client.findById(res.body.id)
    //   expect(dbClient).toBeDefined()
    //   if (!dbClient) return

    //   expect(dbClient.password).not.toBe(newClient.password)
    //   expect(dbClient).toMatchObject({
    //     name: newClient.name,
    //     email: newClient.email,
    //     role: newClient.role,
    //     isEmailVerified: false,
    //   })
    // })

    // test('should be able to create an admin as well', async () => {
    //   await insertClients([admin])
    //   newClient.role = 'admin'

    //   const res = await request(app)
    //     .post('/v1/clients')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newClient)
    //     .expect(httpStatus.CREATED)

    //   expect(res.body.role).toBe('admin')

    //   const dbClient = await Client.findById(res.body.id)
    //   expect(dbClient).toBeDefined()
    //   if (!dbClient) return
    //   expect(dbClient.role).toBe('admin')
    // })

    // test('should return 401 error if access token is missing', async () => {
    //   await request(app).post('/v1/clients').send(newClient).expect(httpStatus.UNAUTHORIZED)
    // })

    // test('should return 403 error if logged in client is not admin', async () => {
    //   await insertClients([clientOne])

    //   await request(app)
    //     .post('/v1/clients')
    //     .set('Authorization', `Bearer ${clientOneAccessToken}`)
    //     .send(newClient)
    //     .expect(httpStatus.FORBIDDEN)
    // })

    // test('should return 400 error if email is invalid', async () => {
    //   await insertClients([admin])
    //   newClient.email = 'invalidEmail'

    //   await request(app)
    //     .post('/v1/clients')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newClient)
    //     .expect(httpStatus.BAD_REQUEST)
    // })

    // test('should return 400 error if email is already used', async () => {
    //   await insertClients([admin, clientOne])
    //   newClient.email = clientOne.email

    //   await request(app)
    //     .post('/v1/clients')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newClient)
    //     .expect(httpStatus.BAD_REQUEST)
    // })

    // test('should return 400 error if password length is less than 8 characters', async () => {
    //   await insertClients([admin])
    //   newClient.password = 'passwo1'

    //   await request(app)
    //     .post('/v1/clients')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newClient)
    //     .expect(httpStatus.BAD_REQUEST)
    // })

    // test('should return 400 error if password does not contain both letters and numbers', async () => {
    //   await insertClients([admin])
    //   newClient.password = 'password'

    //   await request(app)
    //     .post('/v1/clients')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newClient)
    //     .expect(httpStatus.BAD_REQUEST)

    //   newClient.password = '1111111'

    //   await request(app)
    //     .post('/v1/clients')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newClient)
    //     .expect(httpStatus.BAD_REQUEST)
    // })

    test('should return 400 error if role is neither client nor admin', async () => {
      await insertClients([admin])
      ;(newClient as any).role = 'invalid'

      await request(app)
        .post('/v1/clients')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newClient)
        .expect(httpStatus.BAD_REQUEST)
    })
  })

  describe('GET /v1/clients', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertClients([clientOne, clientTwo, admin])

      const res = await request(app)
        .get('/v1/clients')
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
        id: clientOne._id.toHexString(),
        name: clientOne.name,
        email: clientOne.email,
        role: clientOne.role,
        isEmailVerified: clientOne.isEmailVerified,
      })
    })

    test('should return 401 if access token is missing', async () => {
      await insertClients([clientOne, clientTwo, admin])

      await request(app).get('/v1/clients').send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if a non-admin is trying to access all clients', async () => {
      await insertClients([clientOne, clientTwo, admin])

      await request(app)
        .get('/v1/clients')
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should correctly apply filter on name field', async () => {
      await insertClients([clientOne, clientTwo, admin])

      const res = await request(app)
        .get('/v1/clients')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: clientOne.name })
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString())
    })

    test('should correctly apply filter on role field', async () => {
      await insertClients([clientOne, clientTwo, admin])

      const res = await request(app)
        .get('/v1/clients')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: 'client' })
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString())
      expect(res.body.results[1].id).toBe(clientTwo._id.toHexString())
    })

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertClients([clientOne, clientTwo, admin])

      const res = await request(app)
        .get('/v1/clients')
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString())
      expect(res.body.results[1].id).toBe(clientTwo._id.toHexString())
      expect(res.body.results[2].id).toBe(admin._id.toHexString())
    })

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertClients([clientOne, clientTwo, admin])

      const res = await request(app)
        .get('/v1/clients')
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
      expect(res.body.results[1].id).toBe(clientOne._id.toHexString())
      expect(res.body.results[2].id).toBe(clientTwo._id.toHexString())
    })

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertClients([clientOne, clientTwo, admin])

      const res = await request(app)
        .get('/v1/clients')
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

      const expectedOrder = [clientOne, clientTwo, admin].sort((a, b) => {
        if (a.role! < b.role!) {
          return 1
        }
        if (a.role! > b.role!) {
          return -1
        }
        return a.name < b.name ? -1 : 1
      })

      expectedOrder.forEach((client, index) => {
        expect(res.body.results[index].id).toBe(client._id.toHexString())
      })
    })

    test('should limit returned array if limit param is specified', async () => {
      await insertClients([clientOne, clientTwo, admin])

      const res = await request(app)
        .get('/v1/clients')
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString())
      expect(res.body.results[1].id).toBe(clientTwo._id.toHexString())
    })

    test('should return the correct page if page and limit params are specified', async () => {
      await insertClients([clientOne, clientTwo, admin])

      const res = await request(app)
        .get('/v1/clients')
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

  describe('GET /v1/clients/:id', () => {
    test('should return 200 and the client object if data is ok', async () => {
      await insertClients([clientOne])

      const res = await request(app)
        .get(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: clientOne._id.toHexString(),
        email: clientOne.email,
        name: clientOne.name,
        role: clientOne.role,
        isEmailVerified: clientOne.isEmailVerified,
      })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertClients([clientOne])

      await request(app).get(`/v1/clients/${clientOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if client is trying to get another client', async () => {
      await insertClients([clientOne, clientTwo])

      await request(app)
        .get(`/v1/clients/${clientTwo._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and the client object if admin is trying to get another client', async () => {
      await insertClients([clientOne, admin])

      await request(app)
        .get(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertClients([admin])

      await request(app)
        .get('/v1/clients/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if client is not found', async () => {
      await insertClients([admin])

      await request(app)
        .get(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('DELETE /v1/clients/:id', () => {
    test('should return 204 if data is ok', async () => {
      await insertClients([clientOne])

      await request(app)
        .delete(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)

      const dbClient = await Client.findById(clientOne._id)
      expect(dbClient).toBeNull()
    })

    test('should return 401 error if access token is missing', async () => {
      await insertClients([clientOne])

      await request(app).delete(`/v1/clients/${clientOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if client is trying to delete another client', async () => {
      await insertClients([clientOne, clientTwo])

      await request(app)
        .delete(`/v1/clients/${clientTwo._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 204 if admin is trying to delete another client', async () => {
      await insertClients([clientOne, admin])

      await request(app)
        .delete(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertClients([admin])

      await request(app)
        .delete('/v1/clients/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if client already is not found', async () => {
      await insertClients([admin])

      await request(app)
        .delete(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('PATCH /v1/clients/:id', () => {
    test('should return 200 and successfully update client if data is ok', async () => {
      await insertClients([clientOne])
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      }

      const res = await request(app)
        .patch(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: clientOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'client',
        isEmailVerified: false,
      })

      const dbClient = await Client.findById(clientOne._id)
      expect(dbClient).toBeDefined()
      if (!dbClient) return
      // expect(dbClient.password).not.toBe(updateBody.password)
      expect(dbClient).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'client' })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertClients([clientOne])
      const updateBody = { name: faker.name.findName() }

      await request(app).patch(`/v1/clients/${clientOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if client is updating another client', async () => {
      await insertClients([clientOne, clientTwo])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/clients/${clientTwo._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and successfully update client if admin is updating another client', async () => {
      await insertClients([clientOne, admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 404 if admin is updating another client that is not found', async () => {
      await insertClients([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertClients([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/clients/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is invalid', async () => {
      await insertClients([clientOne])
      const updateBody = { email: 'invalidEmail' }

      await request(app)
        .patch(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is already taken', async () => {
      await insertClients([clientOne, clientTwo])
      const updateBody = { email: clientTwo.email }

      await request(app)
        .patch(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should not return 400 if email is my email', async () => {
      await insertClients([clientOne])
      const updateBody = { email: clientOne.email }

      await request(app)
        .patch(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertClients([clientOne])
      const updateBody = { password: 'passwo1' }

      await request(app)
        .patch(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertClients([clientOne])
      const updateBody = { password: 'password' }

      await request(app)
        .patch(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)

      updateBody.password = '11111111'

      await request(app)
        .patch(`/v1/clients/${clientOne._id}`)
        .set('Authorization', `Bearer ${clientOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })
  })
})
