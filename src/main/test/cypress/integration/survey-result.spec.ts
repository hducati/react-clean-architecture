import * as Http from '../utils/http-mocks'
import * as Helper from '../utils/helpers'

const path = /surveys/
export const mockLoadSuccess = (): void => Http.mockOkFixture(path, 'GET', 'load-survey-result')

describe('SurveyResult', () => {
  describe('load', () => {
    const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET')
    const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET')

    beforeEach(() => {
      cy.fixture('account').then(account => {
        Helper.setLocalStorageItem('account', account)
      })
    })

    it('should present error on UnexpectedError', () => {
      cy.visit('/surveys/any_id')
      mockUnexpectedError()

      cy.getByTestId('error').should('contain.text', 'Something went wrong. Please try again')
    })

    it('should logout on AccessDeniedError', () => {
      cy.visit('/surveys/any_id')
      mockAccessDeniedError()
      Helper.testUrl('/login')
    })
  })

  describe('save', () => {
    const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'PUT')
    const mockUnexpectedError = (): void => Http.mockServerError(path, 'PUT')

    beforeEach(() => {
      cy.fixture('account').then(account => {
        Helper.setLocalStorageItem('account', account)
      })
      cy.visit('/surveys/any_id')
      mockLoadSuccess()
    })

    it('should present error on UnexpectedError', () => {
      mockUnexpectedError()

      cy.get('li:nth-child(2)').click()
      cy.getByTestId('error').should('contain.text', 'Something went wrong. Please try again')
    })

    it('should logout on AccessDeniedError', () => {
      mockAccessDeniedError()
      cy.get('li:nth-child(2)').click()
      Helper.testUrl('/login')
    })
  })
})
