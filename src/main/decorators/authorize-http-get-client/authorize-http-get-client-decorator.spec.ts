import { mockGetRequest , GetStorageSpy } from '@/data/test'
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'

type SubjectTypes = {
  subject: AuthorizeHttpGetClientDecorator
  getStorageSpy: GetStorageSpy
}

const makeSubject = (): SubjectTypes => {
  const getStorageSpy = new GetStorageSpy()
  const subject = new AuthorizeHttpGetClientDecorator(getStorageSpy)

  return {
    subject,
    getStorageSpy
  }
}

describe('AuthorizeHttpGetClientDecorator', () => {
  test('should call GetStorage with correct value', () => {
    const getStorageSpy = new GetStorageSpy()
    const subject = new AuthorizeHttpGetClientDecorator(getStorageSpy)
    subject.get(mockGetRequest())

    expect(getStorageSpy.key).toBe('account')
  })

  test('should not add headers if getStorage is invalid', () => {
    const { subject, getStorageSpy } = makeSubject()
    subject.get(mockGetRequest())

    expect(getStorageSpy.key).toBe('account')
  })
})
