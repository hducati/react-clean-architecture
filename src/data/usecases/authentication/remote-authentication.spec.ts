import { HttpPostClientSpy } from '@/data/test'
import { RemoteAuthentication } from './remote-authentication'
import { mockAuthentication, mockAccountModel } from '@/domain/test'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccountModel } from '@/domain/models'

import faker from 'faker'

type SubjectTypes = {
  subject: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AccountModel>
}

const makeSubject = (url: string = faker.internet.url()): SubjectTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AccountModel>()
  const subject = new RemoteAuthentication(url, httpPostClientSpy)

  return {
    subject,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { subject, httpPostClientSpy } = makeSubject(url)
    await subject.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('should call HttpPostClient with correct body', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    const authenticationParams = mockAuthentication()
    await subject.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)
  })

  test('should throw InvalidCredentialsError if HttpsPostClient returns 401', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = subject.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('should throw UnexpectedError if HttpsPostClient returns 400', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = subject.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpsPostClient returns 400', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = subject.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpsPostClient returns 500', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = subject.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return an AccountModel if HttpsPostClient returns 200', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const account = await subject.auth(mockAuthentication())
    expect(account).toEqual(httpResult)
  })
})
