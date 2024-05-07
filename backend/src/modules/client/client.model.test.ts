import { faker } from '@faker-js/faker'
import Client from './client.model'

describe('Client model', () => {
  // describe('Client validation', () => {
  //   let newClient: NewCreatedClient
  //   beforeEach(() => {
  //     newClient = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'client',
  //       clientname: '420entsss',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should correctly validate a valid client', async () => {
  //     await expect(new Client(newClient).validate()).resolves.toBeUndefined()
  //   })

  //   test('should throw a validation error if email is invalid', async () => {
  //     newClient.email = 'invalidEmail'
  //     await expect(new Client(newClient).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password length is less than 8 characters', async () => {
  //     newClient.password = 'passwo1'
  //     await expect(new Client(newClient).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain numbers', async () => {
  //     newClient.password = 'password'
  //     await expect(new Client(newClient).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain letters', async () => {
  //     newClient.password = '11111111'
  //     await expect(new Client(newClient).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if role is unknown', async () => {
  //     newClient.role = 'invalid'
  //     await expect(new Client(newClient).validate()).rejects.toThrow()
  //   })
  // })

  describe('Client toJSON()', () => {
    test('should not return client password when toJSON is called', () => {
      const newClient = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'client',
      }
      expect(new Client(newClient).toJSON()).not.toHaveProperty('password')
    })
  })
})
