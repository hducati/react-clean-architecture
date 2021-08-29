import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { RemoteLoadSurveyResult } from '@/data/usecases'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'

type SubjectTypes = {
  subject: RemoteLoadSurveyResult
  httpClientSpy: HttpClientSpy
}

const makeSubject = (url = faker.internet.url()): SubjectTypes => {
  const httpClientSpy = new HttpClientSpy()
  const subject = new RemoteLoadSurveyResult(url, httpClientSpy)

  return {
    subject,
    httpClientSpy
  }
}

describe('RemoteLoadSurveyResult', () => {
  test('should call HttpClient with correct URL', async () => {
    const url = faker.internet.url()
    const { subject, httpClientSpy } = makeSubject(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel()
    }

    await subject.load()

    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })

  test('should throw AccessDeniedError if HttpPostClient returns 403', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = subject.load()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = subject.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = subject.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return a SurveyResult on 200', async () => {
    const { subject, httpClientSpy } = makeSubject()
    const httpResult = mockRemoteSurveyResultModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const httpResponse = await subject.load()
    expect(httpResponse).toEqual({
      question: httpResult.question,
      answers: httpResult.answers,
      date: new Date(httpResult.date)
    })
  })
})
