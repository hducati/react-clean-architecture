import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import 'jest-localstorage-mock'
import faker from 'faker'
import { AccountModel } from '@/domain/models'

const makeSubject = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should call localStorage.setItem with correct values', () => {
    const subject = makeSubject()
    const key = faker.database.column()
    const value = faker.random.objectElement<AccountModel>()
    subject.set(key, value)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      key, JSON.stringify(value)
    )
  })

  test('should call localStorage.getItem with correct value', () => {
    const subject = makeSubject()
    const key = faker.database.column()
    const localStorageValue = faker.random.objectElement<AccountModel>()
    const getItemSpy = jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(
      JSON.stringify(localStorageValue)
    )
    const localStorageObject = subject.get(key)

    expect(localStorageObject).toEqual(localStorageValue)
    expect(getItemSpy).toHaveBeenCalledWith(key)
  })
})
