import { faker } from '@faker-js/faker'
import Proposal from './proposal.model'

describe('Proposal model', () => {
  // describe('Proposal validation', () => {
  //   let newProposal: NewCreatedProposal
  //   beforeEach(() => {
  //     newProposal = {
  //       name: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: 'password1',
  //       role: 'proposal',
  //       proposalname: '420entsss',
  //       isEmailVerified: false,
  //       phone: '',
  //       nationalId: '',
  //       dob: '',
  //     }
  //   })

  //   test('should correctly validate a valid proposal', async () => {
  //     await expect(new Proposal(newProposal).validate()).resolves.toBeUndefined()
  //   })

  //   test('should throw a validation error if email is invalid', async () => {
  //     newProposal.email = 'invalidEmail'
  //     await expect(new Proposal(newProposal).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password length is less than 8 characters', async () => {
  //     newProposal.password = 'passwo1'
  //     await expect(new Proposal(newProposal).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain numbers', async () => {
  //     newProposal.password = 'password'
  //     await expect(new Proposal(newProposal).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if password does not contain letters', async () => {
  //     newProposal.password = '11111111'
  //     await expect(new Proposal(newProposal).validate()).rejects.toThrow()
  //   })

  //   test('should throw a validation error if role is unknown', async () => {
  //     newProposal.role = 'invalid'
  //     await expect(new Proposal(newProposal).validate()).rejects.toThrow()
  //   })
  // })

  describe('Proposal toJSON()', () => {
    test('should not return proposal password when toJSON is called', () => {
      const newProposal = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'proposal',
      }
      expect(new Proposal(newProposal).toJSON()).not.toHaveProperty('password')
    })
  })
})
