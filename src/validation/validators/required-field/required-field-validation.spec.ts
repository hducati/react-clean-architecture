import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidation } from '@/validation/validators'
import faker from 'faker'

const makeSubject = (field: string): RequiredFieldValidation => new RequiredFieldValidation(field)

describe('RequiredFieldValidation', () => {
  test('should return error if field is empty', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const error = subject.validate({ [field]: '' })

    expect(error).toEqual(new RequiredFieldError())
  })

  test('should return false if field is not empty', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const error = subject.validate({ [field]: faker.random.word() })

    expect(error).toBeFalsy()
  })
})
