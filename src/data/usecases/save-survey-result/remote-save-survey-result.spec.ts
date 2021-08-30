import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { RemoteSaveSurveyResult } from '@/data/usecases'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { mockSaveSurveyResultParams } from '@/domain/test'
import faker from 'faker'

type SubjectTypes = {
  subject: RemoteSaveSurveyResult
  httpClientSpy: HttpClientSpy
}

const makeSubject = (url = faker.internet.url()): SubjectTypes => {
  const httpClientSpy = new HttpClientSpy()
  const subject = new RemoteSaveSurveyResult(url, httpClientSpy)

  return {
    subject,
    httpClientSpy
  }
}

describe('RemoteSaveSurveyResult', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const saveSurveyResult = mockSaveSurveyResultParams()
    const { subject, httpClientSpy } = makeSubject(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel()
    }

    await subject.save(saveSurveyResult)

    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('put')
    expect(httpClientSpy.body).toEqual(saveSurveyResult)
  })

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = subject.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = subject.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = subject.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return a SurveyResult on 200', async () => {
    const { subject, httpClientSpy } = makeSubject()
    const httpResult = mockRemoteSurveyResultModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const httpResponse = await subject.save(mockSaveSurveyResultParams())
    expect(httpResponse).toEqual({
      question: httpResult.question,
      answers: httpResult.answers,
      date: new Date(httpResult.date)
    })
  })
})
