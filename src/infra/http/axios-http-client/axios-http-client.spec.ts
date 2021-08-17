import { AxiosHttpClient } from './axios-http-client'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import { mockPostRequest } from '@/data/test'

import axios from 'axios'

jest.mock('axios')

type SubjectTypes = {
  subject: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSubject = (): SubjectTypes => {
  const subject = new AxiosHttpClient()
  const mockedAxios = mockAxios()

  return {
    subject,
    mockedAxios
  }
}

describe('AxiosHttpClient', () => {
  describe('post', () => {
    test('should call axios.post with correct values', async () => {
      const request = mockPostRequest()
      const { subject, mockedAxios } = makeSubject()
      await subject.post(request)

      expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
    })

    test('should return the correct response on axios.post', () => {
      const { subject, mockedAxios } = makeSubject()
      const promise = subject.post(mockPostRequest())

      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })

    test('should return the correct error on axio.post', () => {
      const { subject, mockedAxios } = makeSubject()
      mockedAxios.post.mockRejectedValueOnce({
        response: mockHttpResponse()
      })
      const promise = subject.post(mockPostRequest())
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })
  })
  describe('post', () => {

  })
})
