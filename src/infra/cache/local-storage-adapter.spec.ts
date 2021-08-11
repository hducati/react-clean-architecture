import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import 'jest-localstorage-mock'
import faker from 'faker'

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should call localStorage with correct values', async () => {
    const sut = new LocalStorageAdapter()
    const key = faker.database.column()
    const value = faker.random.word()
    await sut.set(key, value)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      key, value
    )
  })
})
