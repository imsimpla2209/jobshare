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
import Job from './job.model'
import { NewCreatedJob } from './job.interfaces'

setupTestDB()

const password = 'password1'
const salt = bcrypt.genSaltSync(8)
const hashedPassword = bcrypt.hashSync(password, salt)
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')

const jobOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'job',
  isEmailVerified: false,
}

const jobTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'job',
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

const jobOneAccessToken = tokenService.generateToken(jobOne._id, accessTokenExpires, tokenTypes.ACCESS)
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS)

const insertJobs = async (jobs: Record<string, any>[]) => {
  await Job.insertMany(jobs.map(job => ({ ...job, password: hashedPassword })))
}

describe('Job routes', () => {
  // describe('POST /v1/jobs', () => {
  //   let newJob: NewCreatedJob

  //   beforeEach(() => {
  //     newJob = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'job',
  //       jobname: '420ppppp',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should return 201 and successfully create new job if data is ok', async () => {
  //     await insertJobs([admin])

  //     const res = await request(app)
  //       .post('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newJob)
  //       .expect(httpStatus.CREATED)

  //     expect(res.body).not.toHaveProperty('password')
  //     expect(res.body).toEqual({
  //       id: expect.anything(),
  //       name: newJob.name,
  //       email: newJob.email,
  //       role: newJob.role,
  //       isEmailVerified: false,
  //     })

  //     const dbJob = await Job.findById(res.body.id)
  //     expect(dbJob).toBeDefined()
  //     if (!dbJob) return

  //     expect(dbJob.password).not.toBe(newJob.password)
  //     expect(dbJob).toMatchObject({
  //       name: newJob.name,
  //       email: newJob.email,
  //       role: newJob.role,
  //       isEmailVerified: false,
  //     })
  //   })

  //   test('should be able to create an admin as well', async () => {
  //     await insertJobs([admin])
  //     newJob.role = 'admin'

  //     const res = await request(app)
  //       .post('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newJob)
  //       .expect(httpStatus.CREATED)

  //     expect(res.body.role).toBe('admin')

  //     const dbJob = await Job.findById(res.body.id)
  //     expect(dbJob).toBeDefined()
  //     if (!dbJob) return
  //     expect(dbJob.role).toBe('admin')
  //   })

  //   test('should return 401 error if access token is missing', async () => {
  //     await request(app).post('/v1/jobs').send(newJob).expect(httpStatus.UNAUTHORIZED)
  //   })

  //   test('should return 403 error if logged in job is not admin', async () => {
  //     await insertJobs([jobOne])

  //     await request(app)
  //       .post('/v1/jobs')
  //       .set('Authorization', `Bearer ${jobOneAccessToken}`)
  //       .send(newJob)
  //       .expect(httpStatus.FORBIDDEN)
  //   })

  //   test('should return 400 error if email is invalid', async () => {
  //     await insertJobs([admin])
  //     newJob.email = 'invalidEmail'

  //     await request(app)
  //       .post('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newJob)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if email is already used', async () => {
  //     await insertJobs([admin, jobOne])
  //     newJob.email = jobOne.email

  //     await request(app)
  //       .post('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newJob)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if password length is less than 8 characters', async () => {
  //     await insertJobs([admin])
  //     newJob.password = 'passwo1'

  //     await request(app)
  //       .post('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newJob)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if password does not contain both letters and numbers', async () => {
  //     await insertJobs([admin])
  //     newJob.password = 'password'

  //     await request(app)
  //       .post('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newJob)
  //       .expect(httpStatus.BAD_REQUEST)

  //     newJob.password = '1111111'

  //     await request(app)
  //       .post('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newJob)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })

  //   test('should return 400 error if role is neither job nor admin', async () => {
  //     await insertJobs([admin])
  //     ;(newJob as any).role = 'invalid'

  //     await request(app)
  //       .post('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(newJob)
  //       .expect(httpStatus.BAD_REQUEST)
  //   })
  // })

  // describe('GET /v1/jobs', () => {
  //   test('should return 200 and apply the default query options', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     const res = await request(app)
  //       .get('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send()
  //       .expect(httpStatus.OK)

  //     expect(res.body).toEqual({
  //       results: expect.any(Array),
  //       page: 1,
  //       limit: 10,
  //       totalPages: 1,
  //       totalResults: 3,
  //     })
  //     expect(res.body.results).toHaveLength(3)
  //     expect(res.body.results[0]).toEqual({
  //       id: jobOne._id.toHexString(),
  //       name: jobOne.name,
  //       email: jobOne.email,
  //       role: jobOne.role,
  //       isEmailVerified: jobOne.isEmailVerified,
  //     })
  //   })

  //   test('should return 401 if access token is missing', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     await request(app).get('/v1/jobs').send().expect(httpStatus.UNAUTHORIZED)
  //   })

  //   test('should return 403 if a non-admin is trying to access all jobs', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     await request(app)
  //       .get('/v1/jobs')
  //       .set('Authorization', `Bearer ${jobOneAccessToken}`)
  //       .send()
  //       .expect(httpStatus.FORBIDDEN)
  //   })

  //   test('should correctly apply filter on name field', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     const res = await request(app)
  //       .get('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ name: jobOne.name })
  //       .send()
  //       .expect(httpStatus.OK)

  //     expect(res.body).toEqual({
  //       results: expect.any(Array),
  //       page: 1,
  //       limit: 10,
  //       totalPages: 1,
  //       totalResults: 1,
  //     })
  //     expect(res.body.results).toHaveLength(1)
  //     expect(res.body.results[0].id).toBe(jobOne._id.toHexString())
  //   })

  //   test('should correctly apply filter on role field', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     const res = await request(app)
  //       .get('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ role: 'job' })
  //       .send()
  //       .expect(httpStatus.OK)

  //     expect(res.body).toEqual({
  //       results: expect.any(Array),
  //       page: 1,
  //       limit: 10,
  //       totalPages: 1,
  //       totalResults: 2,
  //     })
  //     expect(res.body.results).toHaveLength(2)
  //     expect(res.body.results[0].id).toBe(jobOne._id.toHexString())
  //     expect(res.body.results[1].id).toBe(jobTwo._id.toHexString())
  //   })

  //   test('should correctly sort the returned array if descending sort param is specified', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     const res = await request(app)
  //       .get('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ sortBy: 'role:desc' })
  //       .send()
  //       .expect(httpStatus.OK)

  //     expect(res.body).toEqual({
  //       results: expect.any(Array),
  //       page: 1,
  //       limit: 10,
  //       totalPages: 1,
  //       totalResults: 3,
  //     })
  //     expect(res.body.results).toHaveLength(3)
  //     expect(res.body.results[0].id).toBe(jobOne._id.toHexString())
  //     expect(res.body.results[1].id).toBe(jobTwo._id.toHexString())
  //     expect(res.body.results[2].id).toBe(admin._id.toHexString())
  //   })

  //   test('should correctly sort the returned array if ascending sort param is specified', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     const res = await request(app)
  //       .get('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ sortBy: 'role:asc' })
  //       .send()
  //       .expect(httpStatus.OK)

  //     expect(res.body).toEqual({
  //       results: expect.any(Array),
  //       page: 1,
  //       limit: 10,
  //       totalPages: 1,
  //       totalResults: 3,
  //     })
  //     expect(res.body.results).toHaveLength(3)
  //     expect(res.body.results[0].id).toBe(admin._id.toHexString())
  //     expect(res.body.results[1].id).toBe(jobOne._id.toHexString())
  //     expect(res.body.results[2].id).toBe(jobTwo._id.toHexString())
  //   })

  //   test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     const res = await request(app)
  //       .get('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ sortBy: 'role:desc,name:asc' })
  //       .send()
  //       .expect(httpStatus.OK)

  //     expect(res.body).toEqual({
  //       results: expect.any(Array),
  //       page: 1,
  //       limit: 10,
  //       totalPages: 1,
  //       totalResults: 3,
  //     })
  //     expect(res.body.results).toHaveLength(3)

  //     const expectedOrder = [jobOne, jobTwo, admin].sort((a, b) => {
  //       if (a.role! < b.role!) {
  //         return 1
  //       }
  //       if (a.role! > b.role!) {
  //         return -1
  //       }
  //       return a.name < b.name ? -1 : 1
  //     })

  //     expectedOrder.forEach((job, index) => {
  //       expect(res.body.results[index].id).toBe(job._id.toHexString())
  //     })
  //   })

  //   test('should limit returned array if limit param is specified', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     const res = await request(app)
  //       .get('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ limit: 2 })
  //       .send()
  //       .expect(httpStatus.OK)

  //     expect(res.body).toEqual({
  //       results: expect.any(Array),
  //       page: 1,
  //       limit: 2,
  //       totalPages: 2,
  //       totalResults: 3,
  //     })
  //     expect(res.body.results).toHaveLength(2)
  //     expect(res.body.results[0].id).toBe(jobOne._id.toHexString())
  //     expect(res.body.results[1].id).toBe(jobTwo._id.toHexString())
  //   })

  //   test('should return the correct page if page and limit params are specified', async () => {
  //     await insertJobs([jobOne, jobTwo, admin])

  //     const res = await request(app)
  //       .get('/v1/jobs')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ page: 2, limit: 2 })
  //       .send()
  //       .expect(httpStatus.OK)

  //     expect(res.body).toEqual({
  //       results: expect.any(Array),
  //       page: 2,
  //       limit: 2,
  //       totalPages: 2,
  //       totalResults: 3,
  //     })
  //     expect(res.body.results).toHaveLength(1)
  //     expect(res.body.results[0].id).toBe(admin._id.toHexString())
  //   })
  // })

  describe('GET /v1/jobs/:id', () => {
    test('should return 200 and the job object if data is ok', async () => {
      await insertJobs([jobOne])

      const res = await request(app)
        .get(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: jobOne._id.toHexString(),
        email: jobOne.email,
        name: jobOne.name,
        role: jobOne.role,
        isEmailVerified: jobOne.isEmailVerified,
      })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertJobs([jobOne])

      await request(app).get(`/v1/jobs/${jobOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if job is trying to get another job', async () => {
      await insertJobs([jobOne, jobTwo])

      await request(app)
        .get(`/v1/jobs/${jobTwo._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and the job object if admin is trying to get another job', async () => {
      await insertJobs([jobOne, admin])

      await request(app)
        .get(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertJobs([admin])

      await request(app)
        .get('/v1/jobs/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if job is not found', async () => {
      await insertJobs([admin])

      await request(app)
        .get(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('DELETE /v1/jobs/:id', () => {
    test('should return 204 if data is ok', async () => {
      await insertJobs([jobOne])

      await request(app)
        .delete(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)

      const dbJob = await Job.findById(jobOne._id)
      expect(dbJob).toBeNull()
    })

    test('should return 401 error if access token is missing', async () => {
      await insertJobs([jobOne])

      await request(app).delete(`/v1/jobs/${jobOne._id}`).send().expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 error if job is trying to delete another job', async () => {
      await insertJobs([jobOne, jobTwo])

      await request(app)
        .delete(`/v1/jobs/${jobTwo._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 204 if admin is trying to delete another job', async () => {
      await insertJobs([jobOne, admin])

      await request(app)
        .delete(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertJobs([admin])

      await request(app)
        .delete('/v1/jobs/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 404 error if job already is not found', async () => {
      await insertJobs([admin])

      await request(app)
        .delete(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })
  })

  describe('PATCH /v1/jobs/:id', () => {
    test('should return 200 and successfully update job if data is ok', async () => {
      await insertJobs([jobOne])
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      }

      const res = await request(app)
        .patch(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toEqual({
        id: jobOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'job',
        isEmailVerified: false,
      })

      const dbJob = await Job.findById(jobOne._id)
      expect(dbJob).toBeDefined()
      if (!dbJob) return
      // expect(dbJob.password).not.toBe(updateBody.password)
      expect(dbJob).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'job' })
    })

    test('should return 401 error if access token is missing', async () => {
      await insertJobs([jobOne])
      const updateBody = { name: faker.name.findName() }

      await request(app).patch(`/v1/jobs/${jobOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 403 if job is updating another job', async () => {
      await insertJobs([jobOne, jobTwo])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/jobs/${jobTwo._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN)
    })

    test('should return 200 and successfully update job if admin is updating another job', async () => {
      await insertJobs([jobOne, admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 404 if admin is updating another job that is not found', async () => {
      await insertJobs([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND)
    })

    test('should return 400 error if id is not a valid mongo id', async () => {
      await insertJobs([admin])
      const updateBody = { name: faker.name.findName() }

      await request(app)
        .patch(`/v1/jobs/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is invalid', async () => {
      await insertJobs([jobOne])
      const updateBody = { email: 'invalidEmail' }

      await request(app)
        .patch(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if email is already taken', async () => {
      await insertJobs([jobOne, jobTwo])
      const updateBody = { email: jobTwo.email }

      await request(app)
        .patch(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should not return 400 if email is my email', async () => {
      await insertJobs([jobOne])
      const updateBody = { email: jobOne.email }

      await request(app)
        .patch(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK)
    })

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertJobs([jobOne])
      const updateBody = { password: 'passwo1' }

      await request(app)
        .patch(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertJobs([jobOne])
      const updateBody = { password: 'password' }

      await request(app)
        .patch(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)

      updateBody.password = '11111111'

      await request(app)
        .patch(`/v1/jobs/${jobOne._id}`)
        .set('Authorization', `Bearer ${jobOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST)
    })
  })
})
