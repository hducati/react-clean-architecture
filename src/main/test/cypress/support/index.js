Cypress.Commands.add('getByTestId', (id) => cy.get(`[data-testid=${id}]`))
Cypress.Commands.add('mockRequest', (method, url, statusCode, body) =>
  cy.intercept({
    method: method,
    url: url
  }, {
    statusCode: statusCode,
    body: {
      body
    }
  }))
