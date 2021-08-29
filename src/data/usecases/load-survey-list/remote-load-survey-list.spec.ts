import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteSurveyListModel } from '@/data/test'
import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/remote-load-survey-list'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { mockSurveyListModel } from '@/domain/test'
import faker from 'faker'

type SubjectTypes = {
  subject: RemoteLoadSurveyList
  httpClientSpy: HttpClientSpy<RemoteLoadSurveyList.Model[]>
}

const makeSubject = (url = faker.internet.url()): SubjectTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadSurveyList.Model[]>()
  const subject = new RemoteLoadSurveyList(url, httpClientSpy)

  return {
    subject,
    httpClientSpy
  }
}

describe('RemoteLoadSurveyList', () => {
  test('should call HttpClient with correct URL and method', async () => {
    const url = faker.internet.url()
    const { subject, httpClientSpy } = makeSubject(url)
    await subject.loadAll()

    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })

  test('should throw AccessDeniedError if HttpPostClient returns 403', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }

    const promise = subject.loadAll()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }

    const promise = subject.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { subject, httpClientSpy } = makeSubject()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }

    const promise = subject.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return an list of SurveyModels if HttpClient returns 200', async () => {
    const { subject, httpClientSpy } = makeSubject()
    const httpResult = mockRemoteSurveyListModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }

    const surveyList = await subject.loadAll()

    expect(surveyList).toEqual([{
      id: httpResult[0].id,
      question: httpResult[0].question,
      didAnswer: httpResult[0].didAnswer,
      date: new Date(httpResult[0].date)
    }, {
      id: httpResult[1].id,
      question: httpResult[1].question,
      didAnswer: httpResult[1].didAnswer,
      date: new Date(httpResult[1].date)
    }, {
      id: httpResult[2].id,
      question: httpResult[2].question,
      didAnswer: httpResult[2].didAnswer,
      date: new Date(httpResult[2].date)
    }
    ])
  })

  test('should return an empty list if HttpClient returns 204', async () => {
    const { subject, httpClientSpy } = makeSubject()
    mockSurveyListModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }

    const surveyList = await subject.loadAll()

    expect(surveyList).toEqual([])
  })
})
