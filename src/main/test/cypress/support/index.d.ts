declare namespace Cypress {
  interface Chainable {
    getByTestId: (id: string) => Chainable<Element>
    mockRequest: (method: string, url: RegExp, statusCode: number, body: object) => Chainable<Element>
  }
}
