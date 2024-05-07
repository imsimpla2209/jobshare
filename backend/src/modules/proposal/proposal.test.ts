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
import Proposal from './proposal.model'

setupTestDB()

const password = 'password1'
const salt = bcrypt.genSaltSync(8)
const hashedPassword = bcrypt.hashSync(password, salt)
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')

const proposalOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'proposal',
  isEmailVerified: false,
}

const proposalTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'proposal',
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

const proposalOneAccessToken = tokenService.generateToken(proposalOne._id, accessTokenExpires, tokenTypes.ACCESS)
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS)

const insertProposals = async (proposals: Record<string, any>[]) => {
  await Proposal.insertMany(proposals.map(proposal => ({ ...proposal, password: hashedPassword })))
}

describe('Proposal routes', () => {
  // describe('POST /v1/proposals', () => {
  //   let newProposal: NewCreatedProposal

  //   beforeEach(() => {
  //     newProposal = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'proposal',
  //       proposalname: '420ppppp',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should return 201 and successfully create new proposal if data is ok', async () => {
  //     await insertProposals([admin])

  //     const res = await request(app)
  //       .post('/v1/proposals')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newProposal)
  //       .expect(httpStatus.CREATED)

  //     expect(res.body).not.toHaveProperty('password')
  //     expect(res.body).toEqual({
  //       id: expect.anything(),
  //       name: newProposal.name,
  //       email: newProposal.email,
  //       role: newProposal.role,
  //       isEmailVerified: false,
  //     })

  //     const dbProposal = await Proposal.findById(res.body.id)
  //     expect(dbProposal).toBeDefined()
  //     if (!dbProposal) return

  //     expect(dbProposal.password).not.toBe(newProposal.password)
  //     expect(dbProposal).toMatchObject({
  //       name: newProposal.name,
  //       email: newProposal.email,
  //       role: newProposal.role,
  //       isEmailVerified: false,
  //     })
  //   })

  //   test('should be able to create an admin as well', async () => {
  //     await insertProposals([admin])
  //     newProposal.role = 'admin'

  //     const res = await request(app)
  //       .post('/v1/proposals')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newProposal)
  //       .expect(httpStatus.CREATED)

  //     expect(res.body.role).toBe('admin')

  //     const dbProposal = await Proposal.findById(res.body.id)
  //     expect(dbProposal).toBeDefined()
  //     if (!dbProposal) return
  //     expect(dbProposal.role).toBe('admin')
  //   })

  //   test('should return 401 error if access token is missing', async () => {
  //     await request(app).post('/v1/proposals').send(newProposal).expect(httpStatus.UNAUTHORIZED)
  //   })

  //   test('should return 403 error if logged in proposal is not admin', async () => {
  //     await insertProposals([proposalOne])

  //     await request(app)
  //       .post('/v1/proposals')
  //       .set('Authorization', `Bearer ${proposalOneAccessToken}`)
  //       .send(newProposal)
  //       .expect(httpStatus.FORBIDDEN)
  //   })

  //   test('should return 400 error if email is invalid', async () => {
  //     await insertProposals([admin])
  //     newProposal.email = 'invalidEmail'

  //     await request(app)
  //       .post('/v1/proposals')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newProposal)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if email is already used', async () => {
  //     await insertProposals([admin, proposalOne])
  //     newProposal.email = proposalOne.email

  //     await request(app)
  //       .post('/v1/proposals')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newProposal)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if password length is less than 8 characters', async () => {
  //     await insertProposals([admin])
  //     newProposal.password = 'passwo1'

  //     await request(app)
  //       .post('/v1/proposals')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newProposal)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if password does not contain both letters and numbers', async () => {
  //     await insertProposals([admin])
  //     newProposal.password = 'password'

  //     await request(app)
  //       .post('/v1/proposals')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newProposal)
  //       .expect(httpStatus.BAD_REQUEST)

  //     newProposal.password = '1111111'

  //     await request(app)
  //       .post('/v1/proposals')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newProposal)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if role is neither proposal nor admin', async () => {
  //     await insertProposals([admin])
  //     ;(newProposal as any).role = 'invalid'

  //     await request(app)
  //       .post('/v1/proposals')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newProposal)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })
  // })

  describe('GET /v1/proposals', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      const res = await request(app)
        .get('/v1/proposals')
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
        id: proposalOne._id.toHexString(),
        name: proposalOne.name,
        email: proposalOne.email,
        role: proposalOne.role,
        isEmailVerified: proposalOne.isEmailVerified,
      })
    })

    test('should return 401 if access token is missing', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      await request(app).get('/v1/proposals').send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if a non-admin is trying to access all proposals', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      await request(app)
        .get('/v1/proposals')
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should correctly apply filter on name field', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      const res = await request(app)
        .get('/v1/proposals')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: proposalOne.name })
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
      expect(res.body.results[0].id).toBe(proposalOne._id.toHexString())
    })

    test('should correctly apply filter on role field', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      const res = await request(app)
        .get('/v1/proposals')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: 'proposal' })
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
      expect(res.body.results[0].id).toBe(proposalOne._id.toHexString())
      expect(res.body.results[1].id).toBe(proposalTwo._id.toHexString())
    })

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      const res = await request(app)
        .get('/v1/proposals')
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
      expect(res.body.results[0].id).toBe(proposalOne._id.toHexString())
      expect(res.body.results[1].id).toBe(proposalTwo._id.toHexString())
      expect(res.body.results[2].id).toBe(admin._id.toHexString())
    })

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      const res = await request(app)
        .get('/v1/proposals')
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
      expect(res.body.results[1].id).toBe(proposalOne._id.toHexString())
      expect(res.body.results[2].id).toBe(proposalTwo._id.toHexString())
    })

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      const res = await request(app)
        .get('/v1/proposals')
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

      const expectedOrder = [proposalOne, proposalTwo, admin].sort((a, b) => {
        if (a.role! < b.role!) {
          return 1
        }
        if (a.role! > b.role!) {
          return -1
        }
        return a.name < b.name ? -1 : 1
      })

      expectedOrder.forEach((proposal, index) => {
        expect(res.body.results[index].id).toBe(proposal._id.toHexString())
      })
    })

    test('should limit returned array if limit param is specified', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      const res = await request(app)
        .get('/v1/proposals')
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
      expect(res.body.results[0].id).toBe(proposalOne._id.toHexString())
      expect(res.body.results[1].id).toBe(proposalTwo._id.toHexString())
    })

    test('should return the correct page if page and limit params are specified', async () => {
      await insertProposals([proposalOne, proposalTwo, admin])

      const res = await request(app)
        .get('/v1/proposals')
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

  describe('GET /v1/proposals/:id', () => {
    test('should return 200 and the proposal object if data is ok', async () => {
      await insertProposals([proposalOne])

      const res = await request(app)
        .get(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: proposalOne._id.toHexString(),
        email: proposalOne.email,
        name: proposalOne.name,
        role: proposalOne.role,
        isEmailVerified: proposalOne.isEmailVerified,
      })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertProposals([proposalOne])

      await request(app).get(`/v1/proposals/${proposalOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if proposal is trying to get another proposal', async () => {
      await insertProposals([proposalOne, proposalTwo])

      await request(app)
        .get(`/v1/proposals/${proposalTwo._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and the proposal object if admin is trying to get another proposal', async () => {
      await insertProposals([proposalOne, admin])

      await request(app)
        .get(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertProposals([admin])

      await request(app)
        .get('/v1/proposals/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if proposal is not found', async () => {
      await insertProposals([admin])

      await request(app)
        .get(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('DELETE /v1/proposals/:id', () => {
    test('should return 204 if data is ok', async () => {
      await insertProposals([proposalOne])

      await request(app)
        .delete(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)

      const dbProposal = await Proposal.findById(proposalOne._id)
      expect(dbProposal).toBeNull()
    })

    test('should return 401 error if access token is missing', async () => {
      await insertProposals([proposalOne])

      await request(app).delete(`/v1/proposals/${proposalOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if proposal is trying to delete another proposal', async () => {
      await insertProposals([proposalOne, proposalTwo])

      await request(app)
        .delete(`/v1/proposals/${proposalTwo._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 204 if admin is trying to delete another proposal', async () => {
      await insertProposals([proposalOne, admin])

      await request(app)
        .delete(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertProposals([admin])

      await request(app)
        .delete('/v1/proposals/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if proposal already is not found', async () => {
      await insertProposals([admin])

      await request(app)
        .delete(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('PATCH /v1/proposals/:id', () => {
    test('should return 200 and successfully update proposal if data is ok', async () => {
      await insertProposals([proposalOne])
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      }

      const res = await request(app)
        .patch(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: proposalOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'proposal',
        isEmailVerified: false,
      })

      const dbProposal = await Proposal.findById(proposalOne._id)
      expect(dbProposal).toBeDefined()
      if (!dbProposal) return
      // expect(dbProposal.password).not.toBe(updateBody.password)
      expect(dbProposal).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'proposal' })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertProposals([proposalOne])
      const updateBody = { name: faker.name.findName() }

      await request(app).patch(`/v1/proposals/${proposalOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if proposal is updating another proposal', async () => {
      await insertProposals([proposalOne, proposalTwo])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/proposals/${proposalTwo._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and successfully update proposal if admin is updating another proposal', async () => {
      await insertProposals([proposalOne, admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 404 if admin is updating another proposal that is not found', async () => {
      await insertProposals([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertProposals([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/proposals/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is invalid', async () => {
      await insertProposals([proposalOne])
      const updateBody = { email: 'invalidEmail' }

      await request(app)
        .patch(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is already taken', async () => {
      await insertProposals([proposalOne, proposalTwo])
      const updateBody = { email: proposalTwo.email }

      await request(app)
        .patch(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should not return 400 if email is my email', async () => {
      await insertProposals([proposalOne])
      const updateBody = { email: proposalOne.email }

      await request(app)
        .patch(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertProposals([proposalOne])
      const updateBody = { password: 'passwo1' }

      await request(app)
        .patch(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertProposals([proposalOne])
      const updateBody = { password: 'password' }

      await request(app)
        .patch(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)

      updateBody.password = '11111111'

      await request(app)
        .patch(`/v1/proposals/${proposalOne._id}`)
        .set('Authorization', `Bearer ${proposalOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })
  })
})
