import { HttpStatusCode } from '@/data/protocols/http'
import { HttpGetClientSpy, mockRemoteSurveyListModel } from '@/data/test'
import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/remote-load-survey-list'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { mockSurveyListModel } from '@/domain/test'
import faker from 'faker'

type SubjectTypes = {
  subject: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<RemoteLoadSurveyList.Model[]>
}

const makeSubject = (url = faker.internet.url()): SubjectTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<RemoteLoadSurveyList.Model[]>()
  const subject = new RemoteLoadSurveyList(url, httpGetClientSpy)

  return {
    subject,
    httpGetClientSpy
  }
}

describe('RemoteLoadSurveyList', () => {
  test('should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const { subject, httpGetClientSpy } = makeSubject(url)
    await subject.loadAll()

    expect(httpGetClientSpy.url).toBe(url)
  })

  test('should throw AccessDeniedError if HttpPostClient returns 403', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }

    const promise = subject.loadAll()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }

    const promise = subject.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }

    const promise = subject.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return an list of SurveyModels if HttpGetClient returns 200', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    const httpResult = mockRemoteSurveyListModel()
    httpGetClientSpy.response = {
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

  test('should return an empty list if HttpGetClient returns 204', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    mockSurveyListModel()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }

    const surveyList = await subject.loadAll()

    expect(surveyList).toEqual([])
  })
})
