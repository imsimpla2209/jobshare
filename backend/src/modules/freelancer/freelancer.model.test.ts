import { faker } from '@faker-js/faker'
import { NewRegisteredFreelancer } from './freelancer.interfaces'
import Freelancer from './freelancer.model'

describe('Freelancer model', () => {
  // describe('Freelancer validation', () => {
  //   let newFreelancer: NewRegisteredFreelancer
  //   beforeEach(() => {
  //     newFreelancer = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'freelancer',
  //       freelancername: '420entsss',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should correctly validate a valid freelancer', async () => {
  //     await expect(new Freelancer(newFreelancer).validate()).resolves.toBeUndefined()
  //   })

  //   test('should throw a validation error if email is invalid', async () => {
  //     newFreelancer.email = 'invalidEmail'
  //     await expect(new Freelancer(newFreelancer).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password length is less than 8 characters', async () => {
  //     newFreelancer.password = 'passwo1'
  //     await expect(new Freelancer(newFreelancer).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain numbers', async () => {
  //     newFreelancer.password = 'password'
  //     await expect(new Freelancer(newFreelancer).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain letters', async () => {
  //     newFreelancer.password = '11111111'
  //     await expect(new Freelancer(newFreelancer).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if role is unknown', async () => {
  //     newFreelancer.role = 'invalid'
  //     await expect(new Freelancer(newFreelancer).validate()).rejects.toThrow()
  //   })
  // })

  describe('Freelancer toJSON()', () => {
    test('should not return freelancer password when toJSON is called', () => {
      const newFreelancer = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'freelancer',
      }
      expect(new Freelancer(newFreelancer).toJSON()).not.toHaveProperty('password')
    })
  })
})
