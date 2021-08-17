import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite'
import { FieldValidationSpy } from '@/validation/test'
import faker from 'faker'

type SubjectTypes = {
  subject: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSubject = (fieldName: string): SubjectTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName)
  ]

  const subject = ValidationComposite.build(fieldValidationsSpy)

  return {
    subject,
    fieldValidationsSpy
  }
}

describe('EmailValidation', () => {
  test('should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { subject, fieldValidationsSpy } = makeSubject(fieldName)
    const errorMessage = faker.random.words()
    fieldValidationsSpy[0].error = new Error(errorMessage)
    fieldValidationsSpy[1].error = new Error(faker.random.words())

    const error = subject.validate(fieldName, { [fieldName]: faker.random.word() })

    expect(error).toBe(errorMessage)
  })

  test('should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { subject } = makeSubject(fieldName)

    const error = subject.validate(fieldName, { [fieldName]: faker.random.word() })

    expect(error).toBeFalsy()
  })
})
