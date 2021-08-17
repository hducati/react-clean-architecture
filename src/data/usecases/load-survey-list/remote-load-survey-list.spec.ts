import { HttpStatusCode } from '@/data/protocols/http'
import { HttpGetClientSpy } from '@/data/test'
import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/remote-load-survey-list'
import { UnexpectedError } from '@/domain/errors'
import { SurveyModel } from '@/domain/models'
import { mockSurveyListModel } from '@/domain/test'
import faker from 'faker'

type SubjectTypes = {
  subject: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<SurveyModel[]>
}

const makeSubject = (url = faker.internet.url()): SubjectTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<SurveyModel[]>()
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

  test('should throw UnexpectedError if HttpPostClient returns 403', async () => {
    const { subject, httpGetClientSpy } = makeSubject()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }

    const promise = subject.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
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
    const httpResult = mockSurveyListModel()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }

    const surveyList = await subject.loadAll()

    expect(surveyList).toEqual(httpResult)
  })
})
