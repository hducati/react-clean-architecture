import { InvalidFieldError } from '@/validation/errors'
import { CompareFieldsValidation } from '@/validation/validators'
import faker from 'faker'

const makeSut = (valueToCompare: string): CompareFieldsValidation => new CompareFieldsValidation(
  faker.database.column(), valueToCompare
)

describe('CompareFieldsValidator', () => {
  test('should return error if compare is invalid', () => {
    const sut = makeSut(faker.random.word())
    const error = sut.validate(faker.random.word())

    expect(error).toEqual(new InvalidFieldError())
  })
})
