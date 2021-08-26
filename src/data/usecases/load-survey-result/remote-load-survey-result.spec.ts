import { HttpGetClientSpy } from '@/data/test'
import { RemoteLoadSurveyResult } from '@/data/usecases'
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
})
