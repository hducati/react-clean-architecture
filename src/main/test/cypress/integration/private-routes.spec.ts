import * as Helper from '../support/helpers'

describe('PrivateRoutes', () => {
  it('should logout if survey-list has no token', () => {
    cy.visit('')
    Helper.testUrl('/login')
  })
})
