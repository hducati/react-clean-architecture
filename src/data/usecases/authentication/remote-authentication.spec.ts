import { HttpClientSpy } from '@/data/test'
import { RemoteAuthentication } from './remote-authentication'
import { mockAuthentication, mockAuthenticationModel } from '@/domain/test'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { HttpStatusCode } from '@/data/protocols/http'

import faker from 'faker'

type SubjectTypes = {
  subject: RemoteAuthentication
  httpClientSpy: HttpClientSpy<RemoteAuthentication.Model>
}

const makeSubject = (url: string = faker.internet.url()): SubjectTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteAuthentication.Model>()
  const subject = new RemoteAuthentication(url, httpClientSpy)

  return {
    subject,
    httpClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('should call HttpClient with correct URL and method', async () => {
    const url = faker.internet.url()
    const { subject, httpClientSpy } = makeSubject(url)
    await subject.auth(mockAuthentication())
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('post')
  })

  test('should call HttpClient with correct body', async () => {
    const { subject, httpClientSpy } = makeSubject()
    const authenticationParams = mockAuthentication()
    await subject.auth(authenticationParams)
    expect(httpClientSpy.body).toEqual(authenticationParams)
  })

  test('should throw InvalidCredentialsError if HttpsClient returns 401', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = subject.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('should throw UnexpectedError if HttpsClient returns 400', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = subject.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpsClient returns 400', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = subject.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpsClient returns 500', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = subject.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return an Authentication.Model if HttpsClient returns 200', async () => {
    const { subject, httpClientSpy } = makeSubject()
    const httpResult = mockAuthenticationModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const account = await subject.auth(mockAuthentication())
    expect(account).toEqual(httpResult)
  })
})
