import { HttpGetClientSpy } from '@/data/test'
import faker from 'faker'
import { RemoteLoadSurveyResult } from '@/data/usecases'

describe('RemoteLoadSurveyResult', () => {
  test('should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const httpGetClientSpy = new HttpGetClientSpy()
    const subject = new RemoteLoadSurveyResult(url, httpGetClientSpy)
    await subject.load()

    expect(httpGetClientSpy.url).toBe(url)
  })
})
