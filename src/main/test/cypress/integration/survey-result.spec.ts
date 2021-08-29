import * as Http from '../utils/http-mocks'
import * as Helper from '../utils/helpers'

const path = /surveys/
export const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET')
export const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET')
export const mockSuccess = (): void => Http.mockOkFixture(path, 'GET', 'survey-result')

describe('SurveyResult', () => {
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

  it('should reload on button click', () => {
    cy.visit('/surveys/any_id')
    mockUnexpectedError()

    cy.getByTestId('error').should('contain.text', 'Something went wrong. Please try again')

    mockSuccess()

    cy.getByTestId('reload').click()
  })

  it('should logout on AccessDeniedError', () => {
    cy.visit('/surveys/any_id')
    mockAccessDeniedError()
    Helper.testUrl('/login')
  })

  it('should be able to go back to previous page', () => {
    cy.visit('')
    mockSuccess()
    cy.visit('/surveys/any_id')
    cy.getByTestId('back-button').click()
    Helper.testUrl('/')
  })

  it('should present survey items', () => {
    cy.visit('')
    mockSuccess()
    cy.visit('/surveys/any_id')

    cy.getByTestId('question').should('have.text', 'Question 1')
    cy.getByTestId('day').should('have.text', '03')
    cy.getByTestId('month').should('have.text', 'fev')
    cy.getByTestId('year').should('have.text', '2018')

    cy.get('li:nth-child(1)').then(li => {
      assert.equal(li.find('[data-testid="answer"').text(), 'any_answer')
      assert.equal(li.find('[data-testid="percent"').text(), '70%')
      assert.equal(li.find('[data-testid="image"').attr('src'), 'any_image')
    })
    cy.get('li:nth-child(2)').then(li => {
      assert.equal(li.find('[data-testid="answer"').text(), 'any_answer_2')
      assert.equal(li.find('[data-testid="percent"').text(), '60%')
      assert.notExists(li.find('[data-testid="image"'))
    })
  })
})
