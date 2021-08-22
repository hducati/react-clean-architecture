import faker from 'faker'

export const mockUnauthorizedError = (url: RegExp): void => {
  cy.intercept({
    method: 'POST',
    url: url
  }, {
    statusCode: 401,
    body: {
      error: faker.random.words()
    }
  }).as('request')
}

export const mockForbiddenError = (url: RegExp, method: string): void => {
  cy.intercept({
    method: method,
    url: url
  }, {
    statusCode: 403,
    body: {
      error: faker.random.words()
    }
  }).as('request')
}

export const mockServerError = (url: RegExp, method: string): void => {
  cy.intercept({
    method: method,
    url: url
  }, {
    statusCode: faker.helpers.randomize([400, 404, 500]),
    body: {
      error: faker.random.words()
    }
  }).as('request')
}

export const mockOk = (url: RegExp, method: string, response: any): void => {
  cy.intercept({
    method: method,
    url: url
  }, {
    statusCode: 200,
    response
  }).as('request')
}

export const mockOkFixture = (url: RegExp, method: string, fixture: any): void => {
  cy.intercept({
    method: method,
    url: url
  }, {
    statusCode: 200,
    fixture: fixture
  }
  ).as('request')
}
