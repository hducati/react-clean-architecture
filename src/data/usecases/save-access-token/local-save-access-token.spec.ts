import { LocalSaveAccessToken } from './local-save-access-token'
import { SetStorageMock } from '@/data/test/mock-storage'
import faker from 'faker'

type SutTypes = {
  sut: LocalSaveAccessToken
  setStorageMock: SetStorageMock
}

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalSaveAccessToken(setStorageMock)

  return {
    setStorageMock,
    sut
  }
}

describe('LocalSaveAccessToken', () => {
  test('should call SetStorage with correct value', async () => {
    const { setStorageMock, sut } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)

    expect(setStorageMock.key).toBe('accessToken')
    expect(setStorageMock.value).toBe(accessToken)
  })

  test('should throw error if SetStorage throws', async () => {
    const { setStorageMock, sut } = makeSut()
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error())
    const promise = sut.save(faker.datatype.uuid())

    await expect(promise).rejects.toThrow(new Error())
  })
})
