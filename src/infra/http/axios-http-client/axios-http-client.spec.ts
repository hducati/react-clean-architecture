import { AxiosHttpClient } from './axios-http-client'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import { mockGetRequest, mockPostRequest } from '@/data/test'

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

    test('should return the correct response on axios.post', async () => {
      const { subject, mockedAxios } = makeSubject()

      const httpResponse = await subject.post(mockPostRequest())
      const axiosResponse = await mockedAxios.post.mock.results[0].value

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
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

  describe('get', () => {
    test('should call axios.get with correct values', async () => {
      const request = mockGetRequest()
      const { subject, mockedAxios } = makeSubject()
      await subject.get(request)

      expect(mockedAxios.get).toHaveBeenCalledWith(request.url)
    })

    test('should call correct response on axios.get', async () => {
      const { subject, mockedAxios } = makeSubject()
      const httpResponse = await subject.get(mockGetRequest())
      const axiosResponse = await mockedAxios.get.mock.results[0].value

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })

    test('should return the correct error on axio.get', () => {
      const { subject, mockedAxios } = makeSubject()
      mockedAxios.get.mockRejectedValueOnce({
        response: mockHttpResponse()
      })
      const promise = subject.get(mockGetRequest())

      expect(promise).toEqual(mockedAxios.get.mock.results[0].value)
    })
  })
})
