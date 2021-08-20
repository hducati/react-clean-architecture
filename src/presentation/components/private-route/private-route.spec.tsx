import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { ApiContext } from '@/presentation/contexts'
import PrivateRoute from '@/presentation/components/private-route/private-route'
import { mockAccountModel } from '@/domain/test'

type SubjectTypes = {
  history: MemoryHistory
}

const makeSubject = (account = mockAccountModel()): SubjectTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  render(
      <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
        <Router history={history}>
          <PrivateRoute />
        </Router>
      </ApiContext.Provider>
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
