import { AxiosHttpClient } from './axios-http-client'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import { mockHttpRequest } from '@/data/test'

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
  describe('request', () => {
    test('should call axios with correct values', async () => {
      const request = mockHttpRequest()
      const { subject, mockedAxios } = makeSubject()
      await subject.request(request)

      expect(mockedAxios.request).toHaveBeenCalledWith(
        {
          url: request.url,
          method: request.method,
          data: request.body,
          headers: request.headers
        }
      )
    })

    test('should return the correct response', async () => {
      const { subject, mockedAxios } = makeSubject()

      const httpResponse = await subject.request(mockHttpRequest())
      const axiosResponse = await mockedAxios.request.mock.results[0].value

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })

    test('should return the correct error', () => {
      const { subject, mockedAxios } = makeSubject()
      mockedAxios.request.mockRejectedValueOnce({
        response: mockHttpResponse()
      })
      const promise = subject.request(mockHttpRequest())
      expect(promise).toEqual(mockedAxios.request.mock.results[0].value)
    })
  })
})
