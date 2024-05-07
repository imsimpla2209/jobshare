import { faker } from '@faker-js/faker'
import { NewCreatedJob } from './job.interfaces'
import Job from './job.model'

describe('Job model', () => {
  // describe('Job validation', () => {
  //   let newJob: NewCreatedJob
  //   beforeEach(() => {
  //     newJob = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'job',
  //       jobname: '420entsss',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should correctly validate a valid job', async () => {
  //     await expect(new Job(newJob).validate()).resolves.toBeUndefined()
  //   })

  //   test('should throw a validation error if email is invalid', async () => {
  //     newJob.email = 'invalidEmail'
  //     await expect(new Job(newJob).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password length is less than 8 characters', async () => {
  //     newJob.password = 'passwo1'
  //     await expect(new Job(newJob).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain numbers', async () => {
  //     newJob.password = 'password'
  //     await expect(new Job(newJob).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain letters', async () => {
  //     newJob.password = '11111111'
  //     await expect(new Job(newJob).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if role is unknown', async () => {
  //     newJob.role = 'invalid'
  //     await expect(new Job(newJob).validate()).rejects.toThrow()
  //   })
  // })

  describe('Job toJSON()', () => {
    test('should not return job password when toJSON is called', () => {
      const newJob = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'job',
      }
      expect(new Job(newJob).toJSON()).not.toHaveProperty('password')
    })
  })
})
