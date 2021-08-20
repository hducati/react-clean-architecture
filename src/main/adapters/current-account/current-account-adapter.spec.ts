import { UnexpectedError } from '@/domain/errors'
import { mockAccountModel } from '@/domain/test'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import { setCurrentAccountAdapter, getCurrentAccountAdapter } from './current-account-adapter'

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrentAccountAdapter', () => {
  test('should call LocalStorageAdapter.set with correct values', () => {
    // given
    const account = mockAccountModel()
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set')

    // when
    setCurrentAccountAdapter(account)

    // then
    expect(setSpy).toBeCalledWith('account', account)
  })

  test('should throw UnexpectedError', () => {
    expect(() => {
      setCurrentAccountAdapter(undefined)
    }).toThrow(new UnexpectedError())
  })

  test('should call LocalStorageAdapter.get with correct values', () => {
    // given
    const account = mockAccountModel()
    const getSpy = jest.spyOn(LocalStorageAdapter.prototype, 'get').mockReturnValueOnce(
      account
    )

    // when
    const currentAccount = getCurrentAccountAdapter()

    // then
    expect(getSpy).toHaveBeenCalledWith('account')
    expect(currentAccount).toEqual(account)
  })
})
