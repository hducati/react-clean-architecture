import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { RecoilRoot } from 'recoil'
import PrivateRoute from '@/presentation/components/private-route/private-route'
import { mockAccountModel } from '@/domain/test'
import { currentAccountState } from '../atoms/atoms'

type SubjectTypes = {
  history: MemoryHistory
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
          <PrivateRoute />
        </Router>
      </RecoilRoot>
  )

  return { history }
}

describe('PrivateRoute', () => {
  test('should redirect to /login if token is empty', () => {
    const { history } = makeSubject(null)
    expect(history.location.pathname).toBe('/login')
  })

  test('should render current component if token is not empty', () => {
    const { history } = makeSubject()
    expect(history.location.pathname).toBe('/')
  })
})
