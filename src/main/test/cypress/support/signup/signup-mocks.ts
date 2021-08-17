import * as Helper from '../http-mocks'
import faker from 'faker'

export const mockEmainInUseError = (): void => Helper.mockInvalidCredentialsError(/signup/)
export const mockInvalidData = (): void => Helper.mockOk('POST', /signup/, { invalid: faker.datatype.uuid() })
