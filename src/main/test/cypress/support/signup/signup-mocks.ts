import * as Http from '../http-mocks'
import faker from 'faker'

export const mockEmainInUseError = (): void => Http.mockForbiddenError(/signup/, 'POST')
export const mockUnexpectedError = (): void => Http.mockServerError(/signup/, 'POST')
export const mockOk = (): void => Http.mockOk('POST', /signup/, {
  accessToken: faker.datatype.uuid(), name: faker.name.firstName()
})
