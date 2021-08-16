import faker from 'faker'
import * as Helper from '../support/http-mocks'

export const mockInvalidCredentialsError = (): void => Helper.mockInvalidCredentialsError(/login/)
export const mockUnexpectedError = (): void => Helper.mockUnexpectedError('POST', /login/)
export const mockOk = (): void => Helper.mockOk('POST', /login/, { accessToken: faker.datatype.uuid() })
export const mockInvalidData = (): void => Helper.mockOk('POST', /login/, { invalid: faker.datatype.uuid() })
