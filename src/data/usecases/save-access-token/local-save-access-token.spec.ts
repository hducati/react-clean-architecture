import { LocalSaveAccessToken } from './local-save-access-token'
import { SetStorageSpy } from '@/data/test/mock-storage'
import faker from 'faker'

type SutTypes = {
  sut: LocalSaveAccessToken
  setStorageSpy: SetStorageSpy
}

const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageSpy()
  const sut = new LocalSaveAccessToken(setStorageSpy)

  return {
    setStorageSpy,
    sut
  }
}

describe('LocalSaveAccessToken', () => {
  test('should call SetStorage with correct value', async () => {
    const { setStorageSpy, sut } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)

    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})
