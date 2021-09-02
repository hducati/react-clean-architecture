import { Header } from '@/presentation/components'
import { fireEvent, screen } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { renderWithHistory } from '@/presentation/test'

type SubjectTypes = {
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSubject = (account = mockAccountModel()): SubjectTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  const { setCurrentAccountMock } = renderWithHistory({
    history, Page: Header, account
  })

  return {
    history,
    setCurrentAccountMock
  }
}

describe('Header component', () => {
  test('should call setCurrentAccount with undefined', () => {
    const { history, setCurrentAccountMock } = makeSubject()
    fireEvent.click(screen.getByTestId('logout'))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('should render username correctly', () => {
    const account = mockAccountModel()
    makeSubject(account)
    expect(screen.getByTestId('username')).toHaveTextContent(account.name)
  })
})
