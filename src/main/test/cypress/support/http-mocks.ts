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

export const mockOk = (method: string, url: RegExp, response: object): void => {
  cy.intercept({
    method: method,
    url: url
  }, {
    statusCode: 200,
    body: response
  }).as('request')
}
