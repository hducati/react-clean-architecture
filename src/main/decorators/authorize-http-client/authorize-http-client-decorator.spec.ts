import { HttpRequest } from '@/data/protocols/http'
import { mockHttpRequest , GetStorageSpy, HttpClientSpy } from '@/data/test'
import { mockAccountModel } from '@/domain/test'
import { AuthorizeHttpClientDecorator } from '@/main/decorators'
import faker from 'faker'

type SubjectTypes = {
  subject: AuthorizeHttpClientDecorator
  getStorageSpy: GetStorageSpy
  httpClientSpy: HttpClientSpy
}

const makeSubject = (): SubjectTypes => {
  const getStorageSpy = new GetStorageSpy()
  const httpClientSpy = new HttpClientSpy()
  const subject = new AuthorizeHttpClientDecorator(getStorageSpy, httpClientSpy)

  return {
    subject,
    getStorageSpy,
    httpClientSpy
  }
}

describe('AuthorizeHttpGetClientDecorator', () => {
  test('should call GetStorage with correct value', async () => {
    const { subject, getStorageSpy } = makeSubject()
    await subject.request(mockHttpRequest())

    expect(getStorageSpy.key).toBe('account')
  })

  test('should not add headers if getStorage is invalid', async () => {
    const { subject, httpClientSpy } = makeSubject()
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.random.arrayElement(['get', 'post', 'put', 'delete']),
      headers: {
        field: faker.random.words()
      }
    }
    await subject.request(httpRequest)

    expect(httpClientSpy.url).toBe(httpRequest.url)
    expect(httpClientSpy.headers).toEqual(httpRequest.headers)
    expect(httpClientSpy.method).toBe(httpRequest.method)
  })

  test('should add headers to HttpGetClient', async () => {
    const { subject, getStorageSpy, httpClientSpy } = makeSubject()
    getStorageSpy.value = mockAccountModel()
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.random.arrayElement(['get', 'post', 'put', 'delete'])
    }
    await subject.request(httpRequest)

    expect(httpClientSpy.url).toBe(httpRequest.url)
    expect(httpClientSpy.method).toBe(httpRequest.method)
    expect(httpClientSpy.headers).toEqual({
      'x-access-token': getStorageSpy.value.accessToken
    })
  })

  test('should merge headers to HttpGetClient', async () => {
    const { subject, getStorageSpy, httpClientSpy } = makeSubject()
    const field = faker.random.words()
    getStorageSpy.value = mockAccountModel()
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.random.arrayElement(['get', 'post', 'put', 'delete']),
      headers: {
        field
      }
    }
    await subject.request(httpRequest)

    expect(httpClientSpy.url).toBe(httpRequest.url)
    expect(httpClientSpy.method).toBe(httpRequest.method)
    expect(httpClientSpy.headers).toEqual({
      field,
      'x-access-token': getStorageSpy.value.accessToken
    })
  })

  test('should return the same result as HttpGetClient', async () => {
    const { subject, httpClientSpy } = makeSubject()
    const httpResponse = await subject.request(mockHttpRequest())

    expect(httpResponse).toEqual(httpClientSpy.response)
  })
})
