import { mockGetRequest , GetStorageSpy } from '@/data/test'
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'

describe('AuthorizeHttpGetClientDecorator', () => {
  test('should call GetStorage with correct value', () => {
    const getStorageSpy = new GetStorageSpy()
    const subject = new AuthorizeHttpGetClientDecorator(getStorageSpy)
    subject.get(mockGetRequest())

    expect(getStorageSpy.key).toBe('account')
  })
})
