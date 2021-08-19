import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import 'jest-localstorage-mock'
import faker from 'faker'
import { AccountModel } from '@/domain/models'

const makeSubject = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should call localStorage with correct values', () => {
    const subject = makeSubject()
    const key = faker.database.column()
    const value = faker.random.objectElement<AccountModel>()
    subject.set(key, value)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      key, JSON.stringify(value)
    )
  })
})
