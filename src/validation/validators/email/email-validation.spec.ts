import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from '@/validation/validators'
import faker from 'faker'

const makeSubject = (field: string): EmailValidation => new EmailValidation(field)

describe('EmailValidation', () => {
  test('should return error if email is invalid', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const error = subject.validate({ [field]: faker.random.word() })

    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return false if email is valid', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const error = subject.validate({ [field]: faker.internet.email() })

    expect(error).toBeFalsy()
  })

  test('should return false if email is empty', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const error = subject.validate({ [field]: '' })

    expect(error).toBeFalsy()
  })
})
