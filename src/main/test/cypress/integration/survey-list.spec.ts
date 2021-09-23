import * as Http from '../utils/http-mocks'
import * as Helper from '../utils/helpers'

const path = /surveys/
export const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET')
export const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET')
export const mockSuccess = (): void => Http.mockOkFixture(path, 'GET', 'survey-list')

describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then(account => {
      Helper.setLocalStorageItem('account', account)
    })
  })

  it('should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', 'Something went wrong. Please try again')
  })

  it('should reload on button click', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', 'Something went wrong. Please try again')

    mockSuccess()

    cy.getByTestId('reload').click()
    cy.get('li:not(:empty)').should('have.length', 2)
  })

  it('should logout on AccessDeniedError', () => {
    mockAccessDeniedError()
    cy.visit('')
    Helper.testUrl('/login')
  })

  it('should present correct username', () => {
    const { name } = Helper.getLocalStorageItem('account')
    mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('username').should('contain.text', name)
  })
})
