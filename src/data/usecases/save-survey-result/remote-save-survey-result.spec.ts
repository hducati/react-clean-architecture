import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { RemoteSaveSurveyResult } from '@/data/usecases'
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
  test('should call HttpClient with correct URL', async () => {
    const url = faker.internet.url()
    const { subject, httpClientSpy } = makeSubject(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel()
    }

    await subject.save({ answer: faker.random.word() })

    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('put')
  })
})
