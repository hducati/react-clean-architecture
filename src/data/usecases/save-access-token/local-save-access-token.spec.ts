import { LocalSaveAccessToken } from './local-save-access-token'
import { SetStorageMock } from '@/data/test'
import faker from 'faker'
import { UnexpectedError } from '@/domain/errors'

type SubjectTypes = {
  subject: LocalSaveAccessToken
  setStorageMock: SetStorageMock
}

const makeSubject = (): SubjectTypes => {
  const setStorageMock = new SetStorageMock()
  const subject = new LocalSaveAccessToken(setStorageMock)

  return {
    setStorageMock,
    subject
  }
}

describe('LocalSaveAccessToken', () => {
  test('should call SetStorage with correct value', async () => {
    const { setStorageMock, subject } = makeSubject()
    const accessToken = faker.datatype.uuid()
    await subject.save(accessToken)

    expect(setStorageMock.key).toBe('accessToken')
    expect(setStorageMock.value).toBe(accessToken)
  })

  test('should throw error if SetStorage throws', async () => {
    const { setStorageMock, subject } = makeSubject()
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error())
    const promise = subject.save(faker.datatype.uuid())

    await expect(promise).rejects.toThrow(new Error())
  })

  test('should throw error if accessToken is falsy', async () => {
    const { subject } = makeSubject()
    const promise = subject.save(undefined)

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
