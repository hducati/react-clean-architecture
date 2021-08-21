import { Authentication } from '@/domain/usecases'
import { mockAccountModel } from '@/domain/test'
import faker from 'faker'

export const mockAuthentication = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationModel = (): Authentication.Model => mockAccountModel()
