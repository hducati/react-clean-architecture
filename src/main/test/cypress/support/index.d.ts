declare namespace Cypress {
  interface Chainable {
    getByTestId: (id: string) => Chainable<Element>
    mockRequest: (method, url, statusCode, body) => Chainable<Element>
  }
}
