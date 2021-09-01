import { currentAccountState, Header } from '@/presentation/components'
import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { RecoilRoot } from 'recoil'
import React from 'react'

type SubjectTypes = {
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSubject = (account = mockAccountModel()): SubjectTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const setCurrentAccountMock = jest.fn()
  const mockedState = {
    setCurrentAccount: setCurrentAccountMock,
    getCurrentAccount: () => account
  }
  render(
    <RecoilRoot initializeState = {(snapshot) => snapshot.set(currentAccountState, mockedState)}>
      <Router history={history}>
        <Header />
      </Router>
    </RecoilRoot>
  )

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
