import { HttpStatusCode } from '@/data/protocols/http'
import { HttpGetClientSpy } from '@/data/test'
import { RemoteLoadSurveyResult } from '@/data/usecases'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'

type SubjectTypes = {
  subject: RemoteLoadSurveyResult
  httpGetClientSpy: HttpGetClientSpy
}

const makeSubject = (url = faker.internet.url()): SubjectTypes => {
  const httpGetClientSpy = new HttpGetClientSpy()
  const subject = new RemoteLoadSurveyResult(url, httpGetClientSpy)

  return {
    subject,
    httpGetClientSpy
  }
}

describe('RemoteLoadSurveyResult', () => {
  test('should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const { subject, httpGetClientSpy } = makeSubject(url)
    await subject.load()

    expect(httpGetClientSpy.url).toBe(url)
  })

  test('should throw AccessDeniedError if HttpPostClient returns 403', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = subject.load()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = subject.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = subject.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
