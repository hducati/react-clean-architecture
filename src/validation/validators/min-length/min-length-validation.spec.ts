import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from '@/validation/validators'
import faker from 'faker'

const makeSubject = (field: string): MinLengthValidation => new MinLengthValidation(
  field, 5
)

describe('MinLengthValidation', () => {
  test('should return error if min-length provided is invalid', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const error = subject.validate({ [field]: faker.random.alphaNumeric(4) })

    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if min-length provided is valid', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const error = subject.validate({ [field]: faker.random.alphaNumeric(5) })

    expect(error).toBeFalsy()
  })

  test('should return falsy if field does not exist in schema', () => {
    const subject = makeSubject(faker.database.column())
    const error = subject.validate({ [faker.database.column()]: faker.random.alphaNumeric(5) })

    expect(error).toBeFalsy()
  })
})
