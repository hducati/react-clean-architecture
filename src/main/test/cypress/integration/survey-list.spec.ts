import * as Http from '../utils/http-mocks'
import * as Helper from '../utils/helpers'

const path = /surveys/
export const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET')
export const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET')

describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then(account => {
      Helper.setLocalStorageItem('account', account)
    })
    cy.visit('')
  })

  it('should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.getByTestId('error').should('contain.text', 'Something went wrong. Please try again')
  })

  it('should logout on AccessDeniedError', () => {
    mockAccessDeniedError()
    Helper.testUrl('/login')
  })

  it('should present correct username', () => {
    const { name } = Helper.getLocalStorageItem('account')
    mockUnexpectedError()
    cy.getByTestId('username').should('contain.text', name)
  })

  it('should logout on logout link click', () => {
    mockUnexpectedError()
    cy.getByTestId('logout').click()
    Helper.testUrl('/login')
  })
})
