import faker from 'faker'
import * as Http from '../http-mocks'

export const mockAccessDeniedError = (): void => Http.mockForbiddenError(/surveys/, 'GET')
export const mockUnexpectedError = (): void => Http.mockServerError(/surveys/, 'GET')
export const mockOk = (): void => Http.mockOk('POST', /login/, {
  accessToken: faker.datatype.uuid(), name: faker.name.firstName()
})
