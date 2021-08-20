import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import PrivateRoute from '@/presentation/components/private-route/private-route'

type SubjectTypes = {
  history: MemoryHistory
}

const makeSubject = (): SubjectTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  render(
      <Router history={history}>
        <PrivateRoute />
      </Router>
  )

  return { history }
}

describe('PrivateRoute', () => {
  test('should redirect to /login if token is empty', () => {
    const { history } = makeSubject()
    expect(history.location.pathname).toBe('/login')
  })
})
