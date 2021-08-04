import { InvalidFieldError } from "@/validation/errors/invalid-field-error";
import { MinLengthValidation } from "@/validation/validators/min-length/min-length-validation";

describe('MinLengthValidation', () => {
  test('should return error if min-length provided is invalid', () => {
    const sut = new MinLengthValidation('field', 5);
    const error = sut.validate('123')

    expect(error).toEqual(new InvalidFieldError())
  })
})