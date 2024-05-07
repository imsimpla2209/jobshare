import { faker } from '@faker-js/faker'
import { NewCreatedMessage } from './message.interfaces'
import Message from './message.model'

describe('Message model', () => {
  // describe('Message validation', () => {
  //   let newMessage: NewCreatedMessage
  //   beforeEach(() => {
  //     newMessage = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'message',
  //       messagename: '420entsss',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should correctly validate a valid message', async () => {
  //     await expect(new Message(newMessage).validate()).resolves.toBeUndefined()
  //   })

  //   test('should throw a validation error if email is invalid', async () => {
  //     newMessage.email = 'invalidEmail'
  //     await expect(new Message(newMessage).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password length is less than 8 characters', async () => {
  //     newMessage.password = 'passwo1'
  //     await expect(new Message(newMessage).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain numbers', async () => {
  //     newMessage.password = 'password'
  //     await expect(new Message(newMessage).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain letters', async () => {
  //     newMessage.password = '11111111'
  //     await expect(new Message(newMessage).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if role is unknown', async () => {
  //     newMessage.role = 'invalid'
  //     await expect(new Message(newMessage).validate()).rejects.toThrow()
  //   })
  // })

  describe('Message toJSON()', () => {
    test('should not return message password when toJSON is called', () => {
      const newMessage = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'message',
      }
      expect(new Message(newMessage).toJSON()).not.toHaveProperty('password')
    })
  })
})
