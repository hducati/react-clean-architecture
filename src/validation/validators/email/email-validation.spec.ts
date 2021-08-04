import { InvalidFieldError } from "@/validation/errors/invalid-field-error"
import { EmailValidation } from "@/validation/validators/email/email-validation"
import faker from "faker"

describe('EmailValidation', () => {
  test('should return error if email is invalid', () => {
    const sut = new EmailValidation(faker.random.word())
    const error = sut.validate(faker.random.word())

    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return false if email is valid', () => {
    const sut = new EmailValidation(faker.random.word())
    const error = sut.validate(faker.internet.email())

    expect(error).toBeFalsy()
  })
})