import { createMemoryHistory, MemoryHistory } from 'history'
import PrivateRoute from '@/presentation/components/private-route/private-route'
import { mockAccountModel } from '@/domain/test'
import { renderWithHistory } from '@/presentation/test'

type SubjectTypes = {
  history: MemoryHistory
}

const makeSubject = (account = mockAccountModel()): SubjectTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  renderWithHistory({
    history,
    Page: PrivateRoute,
    account
  })

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
