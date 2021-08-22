export const testInputStatus = (fieldName: string, error?: string): void => {
  const attr = `${error ? '' : 'not.'}have.attr`

  cy.getByTestId(`${fieldName}-wrap`).should('have.attr', 'data-status', error ? 'invalid' : 'valid')
  cy.getByTestId(fieldName).should(attr, 'title', error)
  cy.getByTestId(`${fieldName}-label`).should(attr, 'title', error)
}

export const testMainError = (error?: string): void => {
  cy.getByTestId('spinner').should('not.exist')
  cy.getByTestId('main-error').should('exist', error || '')
}
