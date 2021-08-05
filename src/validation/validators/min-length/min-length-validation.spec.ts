import { InvalidFieldError } from "@/validation/errors/invalid-field-error";
import { MinLengthValidation } from "@/validation/validators";
import faker from "faker"

const makeSut = (): MinLengthValidation => new MinLengthValidation(
  faker.database.column(), 5
)

describe('MinLengthValidation', () => {
  test('should return error if min-length provided is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(4))

    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if min-length provided is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(5))

    expect(error).toBeFalsy()
  })
})