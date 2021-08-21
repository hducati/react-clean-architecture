import { HttpGetParams } from '@/data/protocols/http'
import { mockGetRequest , GetStorageSpy, HttpGetClientSpy } from '@/data/test'
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'
import faker from 'faker'

type SubjectTypes = {
  subject: AuthorizeHttpGetClientDecorator
  getStorageSpy: GetStorageSpy
  httpGetClientSpy: HttpGetClientSpy
}

const makeSubject = (): SubjectTypes => {
  const getStorageSpy = new GetStorageSpy()
  const httpGetClientSpy = new HttpGetClientSpy()
  const subject = new AuthorizeHttpGetClientDecorator(getStorageSpy, httpGetClientSpy)

  return {
    subject,
    getStorageSpy,
    httpGetClientSpy
  }
}

describe('AuthorizeHttpGetClientDecorator', () => {
  test('should call GetStorage with correct value', async () => {
    const { subject, getStorageSpy } = makeSubject()
    await subject.get(mockGetRequest())

    expect(getStorageSpy.key).toBe('account')
  })

  test('should not add headers if getStorage is invalid', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    const httpRequest: HttpGetParams = {
      url: faker.internet.url(),
      headers: {
        field: faker.random.words()
      }
    }
    await subject.get(httpRequest)

    expect(httpGetClientSpy.url).toBe(httpRequest.url)
    expect(httpGetClientSpy.headers).toEqual(httpRequest.headers)
  })
})
