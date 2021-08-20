import { mockAccountModel } from '@/domain/test'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import { setCurrentAccountAdapter } from './current-account-adapter'

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrentAccountAdapter', () => {
  test('shoul call LocalStorageAdapter with correct values', () => {
    // given
    const account = mockAccountModel()
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set')

    // when
    setCurrentAccountAdapter(account)

    // then
    expect(setSpy).toBeCalledWith('account', account)
  })
})
