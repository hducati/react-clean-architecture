import { LocalUpdateCurrentAccount } from './local-update-current-account'
import { SetStorageMock } from '@/data/test'
import faker from 'faker'
import { UnexpectedError } from '@/domain/errors'
import { mockAccountModel } from '@/domain/test'

type SubjectTypes = {
  subject: LocalUpdateCurrentAccount
  setStorageMock: SetStorageMock
}

const makeSubject = (): SubjectTypes => {
  const setStorageMock = new SetStorageMock()
  const subject = new LocalUpdateCurrentAccount(setStorageMock)

  return {
    setStorageMock,
    subject
  }
}

describe('LocalSaveAccessToken', () => {
  test('should call SetStorage with correct value', async () => {
    const { setStorageMock, subject } = makeSubject()
    const account = mockAccountModel()
    await subject.save(account)

    expect(setStorageMock.key).toBe('account')
    expect(setStorageMock.value).toBe(JSON.stringify(account))
  })

  test('should throw error if SetStorage throws', async () => {
    const { setStorageMock, subject } = makeSubject()
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error())
    const promise = subject.save(mockAccountModel())

    await expect(promise).rejects.toThrow(new Error())
  })

  test('should throw error if accessToken is falsy', async () => {
    const { subject } = makeSubject()
    const promise = subject.save(undefined)

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
