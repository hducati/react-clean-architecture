import * as Helper from '../http-mocks'

export const mockEmainInUseError = (): void => Helper.mockInvalidCredentialsError(/signup/)
