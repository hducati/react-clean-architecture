import * as Http from '../support/survey/survey-list-mocks'
import * as Helper from '../support/helpers'
import faker from 'faker'

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', {
      accessToken: faker.datatype.uuid(),
      name: faker.name.findName()
    })
    cy.visit('')
  })

  it('should present error on UnexpectedError', () => {
    Http.mockUnexpectedError()
    cy.getByTestId('error').should('contain.text', 'Something went wrong. Please try again')
  })

  it('should logout on AccessDeniedError', () => {
    Http.mockAccessDeniedError()
    Helper.testUrl('/login')
  })
})
