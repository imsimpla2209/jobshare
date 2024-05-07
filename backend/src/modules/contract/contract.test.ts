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
import Contract from './contract.model'

setupTestDB()

const password = 'password1'
const salt = bcrypt.genSaltSync(8)
const hashedPassword = bcrypt.hashSync(password, salt)
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')

const contractOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'contract',
  isEmailVerified: false,
}

const contractTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'contract',
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

const contractOneAccessToken = tokenService.generateToken(contractOne._id, accessTokenExpires, tokenTypes.ACCESS)
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS)

const insertContracts = async (contracts: Record<string, any>[]) => {
  await Contract.insertMany(contracts.map(contract => ({ ...contract, password: hashedPassword })))
}

describe('Contract routes', () => {
  // describe('POST /v1/contracts', () => {
  //   let newContract: NewCreatedContract

  //   beforeEach(() => {
  //     newContract = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'contract',
  //       contractname: '420ppppp',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  // test('should return 201 and successfully create new contract if data is ok', async () => {
  //   await insertContracts([admin])

  //   const res = await request(app)
  //     .post('/v1/contracts')
  //     .set('Authorization', `Bearer ${adminAccessToken}`)
  //     .send(newContract)
  //     .expect(httpStatus.CREATED)

  //   expect(res.body).not.toHaveProperty('password')
  //   expect(res.body).toEqual({
  //     id: expect.anything(),
  //     name: newContract.name,
  //     email: newContract.email,
  //     role: newContract.role,
  //     isEmailVerified: false,
  //   })

  //   const dbContract = await Contract.findById(res.body.id)
  //   expect(dbContract).toBeDefined()
  //   if (!dbContract) return

  //   expect(dbContract.password).not.toBe(newContract.password)
  //   expect(dbContract).toMatchObject({
  //     name: newContract.name,
  //     email: newContract.email,
  //     role: newContract.role,
  //     isEmailVerified: false,
  //   })
  // })

  // test('should be able to create an admin as well', async () => {
  //   await insertContracts([admin])
  //   newContract.role = 'admin'

  //   const res = await request(app)
  //     .post('/v1/contracts')
  //     .set('Authorization', `Bearer ${adminAccessToken}`)
  //     .send(newContract)
  //     .expect(httpStatus.CREATED)

  //   expect(res.body.role).toBe('admin')

  //   const dbContract = await Contract.findById(res.body.id)
  //   expect(dbContract).toBeDefined()
  //   if (!dbContract) return
  //   expect(dbContract.role).toBe('admin')
  // })

  // test('should return 401 error if access token is missing', async () => {
  //   await request(app).post('/v1/contracts').send(newContract).expect(httpStatus.UNAUTHORIZED)
  // })

  // test('should return 403 error if logged in contract is not admin', async () => {
  //   await insertContracts([contractOne])

  //   await request(app)
  //     .post('/v1/contracts')
  //     .set('Authorization', `Bearer ${contractOneAccessToken}`)
  //     .send(newContract)
  //     .expect(httpStatus.FORBIDDEN)
  // })

  // test('should return 400 error if email is invalid', async () => {
  //   await insertContracts([admin])
  //   newContract.email = 'invalidEmail'

  //   await request(app)
  //     .post('/v1/contracts')
  //     .set('Authorization', `Bearer ${adminAccessToken}`)
  //     .send(newContract)
  //     .expect(httpStatus.BAD_REQUEST)
  // })

  // test('should return 400 error if email is already used', async () => {
  //   await insertContracts([admin, contractOne])
  //   newContract.email = contractOne.email

  //   await request(app)
  //     .post('/v1/contracts')
  //     .set('Authorization', `Bearer ${adminAccessToken}`)
  //     .send(newContract)
  //     .expect(httpStatus.BAD_REQUEST)
  // })

  // test('should return 400 error if password length is less than 8 characters', async () => {
  //   await insertContracts([admin])
  //   newContract.password = 'passwo1'

  //   await request(app)
  //     .post('/v1/contracts')
  //     .set('Authorization', `Bearer ${adminAccessToken}`)
  //     .send(newContract)
  //     .expect(httpStatus.BAD_REQUEST)
  // })

  // test('should return 400 error if password does not contain both letters and numbers', async () => {
  //   await insertContracts([admin])
  //   newContract.password = 'password'

  //   await request(app)
  //     .post('/v1/contracts')
  //     .set('Authorization', `Bearer ${adminAccessToken}`)
  //     .send(newContract)
  //     .expect(httpStatus.BAD_REQUEST)

  //   newContract.password = '1111111'

  //   await request(app)
  //     .post('/v1/contracts')
  //     .set('Authorization', `Bearer ${adminAccessToken}`)
  //     .send(newContract)
  //     .expect(httpStatus.BAD_REQUEST)
  // })

  // test('should return 400 error if role is neither contract nor admin', async () => {
  //   await insertContracts([admin])
  //   ;(newContract as any).role = 'invalid'

  //   await request(app)
  //     .post('/v1/contracts')
  //     .set('Authorization', `Bearer ${adminAccessToken}`)
  //     .send(newContract)
  //     .expect(httpStatus.BAD_REQUEST)
  // })
  // })

  describe('GET /v1/contracts', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      const res = await request(app)
        .get('/v1/contracts')
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
        id: contractOne._id.toHexString(),
        name: contractOne.name,
        email: contractOne.email,
        role: contractOne.role,
        isEmailVerified: contractOne.isEmailVerified,
      })
    })

    test('should return 401 if access token is missing', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      await request(app).get('/v1/contracts').send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if a non-admin is trying to access all contracts', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      await request(app)
        .get('/v1/contracts')
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should correctly apply filter on name field', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      const res = await request(app)
        .get('/v1/contracts')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: contractOne.name })
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
      expect(res.body.results[0].id).toBe(contractOne._id.toHexString())
    })

    test('should correctly apply filter on role field', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      const res = await request(app)
        .get('/v1/contracts')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: 'contract' })
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
      expect(res.body.results[0].id).toBe(contractOne._id.toHexString())
      expect(res.body.results[1].id).toBe(contractTwo._id.toHexString())
    })

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      const res = await request(app)
        .get('/v1/contracts')
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
      expect(res.body.results[0].id).toBe(contractOne._id.toHexString())
      expect(res.body.results[1].id).toBe(contractTwo._id.toHexString())
      expect(res.body.results[2].id).toBe(admin._id.toHexString())
    })

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      const res = await request(app)
        .get('/v1/contracts')
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
      expect(res.body.results[1].id).toBe(contractOne._id.toHexString())
      expect(res.body.results[2].id).toBe(contractTwo._id.toHexString())
    })

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      const res = await request(app)
        .get('/v1/contracts')
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

      const expectedOrder = [contractOne, contractTwo, admin].sort((a, b) => {
        if (a.role! < b.role!) {
          return 1
        }
        if (a.role! > b.role!) {
          return -1
        }
        return a.name < b.name ? -1 : 1
      })

      expectedOrder.forEach((contract, index) => {
        expect(res.body.results[index].id).toBe(contract._id.toHexString())
      })
    })

    test('should limit returned array if limit param is specified', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      const res = await request(app)
        .get('/v1/contracts')
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
      expect(res.body.results[0].id).toBe(contractOne._id.toHexString())
      expect(res.body.results[1].id).toBe(contractTwo._id.toHexString())
    })

    test('should return the correct page if page and limit params are specified', async () => {
      await insertContracts([contractOne, contractTwo, admin])

      const res = await request(app)
        .get('/v1/contracts')
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

  describe('GET /v1/contracts/:id', () => {
    test('should return 200 and the contract object if data is ok', async () => {
      await insertContracts([contractOne])

      const res = await request(app)
        .get(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: contractOne._id.toHexString(),
        email: contractOne.email,
        name: contractOne.name,
        role: contractOne.role,
        isEmailVerified: contractOne.isEmailVerified,
      })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertContracts([contractOne])

      await request(app).get(`/v1/contracts/${contractOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if contract is trying to get another contract', async () => {
      await insertContracts([contractOne, contractTwo])

      await request(app)
        .get(`/v1/contracts/${contractTwo._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and the contract object if admin is trying to get another contract', async () => {
      await insertContracts([contractOne, admin])

      await request(app)
        .get(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertContracts([admin])

      await request(app)
        .get('/v1/contracts/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if contract is not found', async () => {
      await insertContracts([admin])

      await request(app)
        .get(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('DELETE /v1/contracts/:id', () => {
    test('should return 204 if data is ok', async () => {
      await insertContracts([contractOne])

      await request(app)
        .delete(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)

      const dbContract = await Contract.findById(contractOne._id)
      expect(dbContract).toBeNull()
    })

    test('should return 401 error if access token is missing', async () => {
      await insertContracts([contractOne])

      await request(app).delete(`/v1/contracts/${contractOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if contract is trying to delete another contract', async () => {
      await insertContracts([contractOne, contractTwo])

      await request(app)
        .delete(`/v1/contracts/${contractTwo._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 204 if admin is trying to delete another contract', async () => {
      await insertContracts([contractOne, admin])

      await request(app)
        .delete(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertContracts([admin])

      await request(app)
        .delete('/v1/contracts/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if contract already is not found', async () => {
      await insertContracts([admin])

      await request(app)
        .delete(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('PATCH /v1/contracts/:id', () => {
    test('should return 200 and successfully update contract if data is ok', async () => {
      await insertContracts([contractOne])
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      }

      const res = await request(app)
        .patch(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: contractOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'contract',
        isEmailVerified: false,
      })

      const dbContract = await Contract.findById(contractOne._id)
      expect(dbContract).toBeDefined()
      if (!dbContract) return
      // expect(dbContract.password).not.toBe(updateBody.password)
      expect(dbContract).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'contract' })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertContracts([contractOne])
      const updateBody = { name: faker.name.findName() }

      await request(app).patch(`/v1/contracts/${contractOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if contract is updating another contract', async () => {
      await insertContracts([contractOne, contractTwo])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/contracts/${contractTwo._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and successfully update contract if admin is updating another contract', async () => {
      await insertContracts([contractOne, admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 404 if admin is updating another contract that is not found', async () => {
      await insertContracts([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertContracts([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/contracts/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is invalid', async () => {
      await insertContracts([contractOne])
      const updateBody = { email: 'invalidEmail' }

      await request(app)
        .patch(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is already taken', async () => {
      await insertContracts([contractOne, contractTwo])
      const updateBody = { email: contractTwo.email }

      await request(app)
        .patch(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should not return 400 if email is my email', async () => {
      await insertContracts([contractOne])
      const updateBody = { email: contractOne.email }

      await request(app)
        .patch(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertContracts([contractOne])
      const updateBody = { password: 'passwo1' }

      await request(app)
        .patch(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertContracts([contractOne])
      const updateBody = { password: 'password' }

      await request(app)
        .patch(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)

      updateBody.password = '11111111'

      await request(app)
        .patch(`/v1/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${contractOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })
  })
})
