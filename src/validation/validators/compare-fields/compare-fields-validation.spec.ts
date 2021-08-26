import { InvalidFieldError } from '@/validation/errors'
import { CompareFieldsValidation } from '@/validation/validators'
import faker from 'faker'

const makeSubject = (field: string, fieldToCompare: string): CompareFieldsValidation => new CompareFieldsValidation(
  field, fieldToCompare
)

describe('CompareFieldsValidator', () => {
  test('should return error if compare is invalid', () => {
    const field = 'any_column'
    const fieldToCompare = 'any_column_to_compare'
    const subject = makeSubject(field, fieldToCompare)
    const error = subject.validate({
      [field]: 'any_value',
      [fieldToCompare]: 'other_value'
    })

    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if compare is valid', () => {
    const field = 'any_column'
    const fieldToCompare = 'any_column_to_compare'
    const value = faker.random.word()
    const subject = makeSubject(field, fieldToCompare)
    const error = subject.validate({
      [field]: value,
      [fieldToCompare]: value
    })

    expect(error).toBeFalsy()
  })
})
