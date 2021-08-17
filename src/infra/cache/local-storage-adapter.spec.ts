import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import 'jest-localstorage-mock'
import faker from 'faker'

const makeSubject = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should call localStorage with correct values', async () => {
    const subject = makeSubject()
    const key = faker.database.column()
    const value = faker.random.word()
    await subject.set(key, value)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      key, value
    )
  })
})
