import { HttpPostClientSpy } from '@/data/test'
import { RemoteAddAccount } from './remote-add-account'
import { mockAddAccountModel, mockAddAccountParams } from '@/domain/test'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'
import { HttpStatusCode } from '@/data/protocols/http'

type SubjectTypes = {
  subject: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<RemoteAddAccount.Model>
}

const makeSubject = (url: string = faker.internet.url()): SubjectTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<RemoteAddAccount.Model>()
  const subject = new RemoteAddAccount(url, httpPostClientSpy)

  return {
    subject,
    httpPostClientSpy
  }
}

describe('RemoteAddAccount', () => {
  test('should call HttpPostClient with correct url', async () => {
    const url = faker.internet.url()
    const { subject, httpPostClientSpy } = makeSubject(url)

    await subject.add(mockAddAccountParams())

    expect(httpPostClientSpy.url).toBe(url)
  })

  test('should call HttpPostClient with correct body', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    const addAccountParams = mockAddAccountParams()

    await subject.add(addAccountParams)

    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })

  test('should return an AddAccount.Model if HttpPostClient returns 200', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    const httpResult = mockAddAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }

    const account = await subject.add(mockAddAccountParams())

    expect(account).toEqual(httpResult)
  })

  test('should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }

    const promise = subject.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw EmailInUseError if HttpPostClient returns 403', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }

    const promise = subject.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }

    const promise = subject.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { subject, httpPostClientSpy } = makeSubject()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }

    const promise = subject.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
