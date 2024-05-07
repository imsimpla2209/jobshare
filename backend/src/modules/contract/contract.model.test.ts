import { faker } from '@faker-js/faker'
import { NewCreatedContract } from './contract.interfaces'
import Contract from './contract.model'

describe('Contract model', () => {
  // describe('Contract validation', () => {
  //   let newContract: NewCreatedContract
  //   beforeEach(() => {
  //     newContract = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'contract',
  //       contractname: '420entsss',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should correctly validate a valid contract', async () => {
  //     await expect(new Contract(newContract).validate()).resolves.toBeUndefined()
  //   })

  //   test('should throw a validation error if email is invalid', async () => {
  //     newContract.email = 'invalidEmail'
  //     await expect(new Contract(newContract).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password length is less than 8 characters', async () => {
  //     newContract.password = 'passwo1'
  //     await expect(new Contract(newContract).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain numbers', async () => {
  //     newContract.password = 'password'
  //     await expect(new Contract(newContract).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain letters', async () => {
  //     newContract.password = '11111111'
  //     await expect(new Contract(newContract).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if role is unknown', async () => {
  //     newContract.role = 'invalid'
  //     await expect(new Contract(newContract).validate()).rejects.toThrow()
  //   })
  // })

  describe('Contract toJSON()', () => {
    test('should not return contract password when toJSON is called', () => {
      const newContract = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'contract',
      }
      expect(new Contract(newContract).toJSON()).not.toHaveProperty('password')
    })
  })
})
