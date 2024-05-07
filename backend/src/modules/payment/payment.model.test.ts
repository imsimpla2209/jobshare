import { faker } from '@faker-js/faker'
import { NewCreatedPayment } from './payment.interfaces'
import Payment from './payment.model'

describe('Payment model', () => {
  // describe('Payment validation', () => {
  //   let newPayment: NewCreatedPayment
  //   beforeEach(() => {
  //     newPayment = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'payment',
  //       paymentname: '420entsss',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should correctly validate a valid payment', async () => {
  //     await expect(new Payment(newPayment).validate()).resolves.toBeUndefined()
  //   })

  //   test('should throw a validation error if email is invalid', async () => {
  //     newPayment.email = 'invalidEmail'
  //     await expect(new Payment(newPayment).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password length is less than 8 characters', async () => {
  //     newPayment.password = 'passwo1'
  //     await expect(new Payment(newPayment).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain numbers', async () => {
  //     newPayment.password = 'password'
  //     await expect(new Payment(newPayment).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain letters', async () => {
  //     newPayment.password = '11111111'
  //     await expect(new Payment(newPayment).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if role is unknown', async () => {
  //     newPayment.role = 'invalid'
  //     await expect(new Payment(newPayment).validate()).rejects.toThrow()
  //   })
  // })

  describe('Payment toJSON()', () => {
    test('should not return payment password when toJSON is called', () => {
      const newPayment = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'payment',
      }
      expect(new Payment(newPayment).toJSON()).not.toHaveProperty('password')
    })
  })
})
