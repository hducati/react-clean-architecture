import { HttpClientSpy } from '@/data/test'
import { RemoteAddAccount } from './remote-add-account'
import { mockAddAccountModel, mockAddAccountParams } from '@/domain/test'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'
import { HttpStatusCode } from '@/data/protocols/http'

type SubjectTypes = {
  subject: RemoteAddAccount
  httpClientSpy: HttpClientSpy<RemoteAddAccount.Model>
}

const makeSubject = (url: string = faker.internet.url()): SubjectTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteAddAccount.Model>()
  const subject = new RemoteAddAccount(url, httpClientSpy)

  return {
    subject,
    httpClientSpy
  }
}

describe('RemoteAddAccount', () => {
  test('should call HttpClient with correct url and method', async () => {
    const url = faker.internet.url()
    const { subject, httpClientSpy } = makeSubject(url)

    await subject.add(mockAddAccountParams())

    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('post')
  })

  test('should call HttpClient with correct body', async () => {
    const { subject, httpClientSpy } = makeSubject()
    const addAccountParams = mockAddAccountParams()

    await subject.add(addAccountParams)

    expect(httpClientSpy.body).toEqual(addAccountParams)
  })

  test('should return an AddAccount.Model if HttpClient returns 200', async () => {
    const { subject, httpClientSpy } = makeSubject()
    const httpResult = mockAddAccountModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }

    const account = await subject.add(mockAddAccountParams())

    expect(account).toEqual(httpResult)
  })

  test('should throw UnexpectedError if HttpClient returns 400', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }

    const promise = subject.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw EmailInUseError if HttpClient returns 403', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }

    const promise = subject.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }

    const promise = subject.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }

    const promise = subject.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
