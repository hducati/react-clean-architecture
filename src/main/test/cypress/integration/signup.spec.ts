import * as FormHelper from '../utils/form-helpers'
import * as Http from '../utils/http-mocks'
import * as Helper from '../utils/helpers'
import faker from 'faker'

const path = /signup/
const mockEmainInUseError = (): void => Http.mockForbiddenError(path, 'POST')
const mockOk = (): void => Http.mockOkFixture('POST', path, 'account')

const populateFields = (): void => {
  const password = faker.random.alphaNumeric(8)

  cy.getByTestId('name').focus().type(faker.name.findName())
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(password)
  cy.getByTestId('passwordConfirmation').focus().type(password)
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.getByTestId('submit').click()
}

describe('SignUp', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('should load with correct initial state', () => {
    cy.getByTestId('name').should('have.attr', 'readOnly')
    cy.getByTestId('email').should('have.attr', 'readOnly')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('name', 'Campo obrigatório')
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    FormHelper.testInputStatus('passwordConfirmation', 'Campo obrigatório')
    cy.getByTestId('submit').should('have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(4))
    FormHelper.testInputStatus('name', 'Valor inválido')
    cy.getByTestId('email').focus().type(faker.random.word())
    FormHelper.testInputStatus('email', 'Valor inválido')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(4))
    FormHelper.testInputStatus('password', 'Valor inválido')
    cy.getByTestId('passwordConfirmation').focus().type(faker.random.alphaNumeric(4))
    FormHelper.testInputStatus('passwordConfirmation', 'Valor inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present valid state if form is valid', () => {
    const password = faker.random.alphaNumeric(5)

    cy.getByTestId('name').focus().type(faker.name.findName())
    FormHelper.testInputStatus('name')
    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.getByTestId('password').focus().type(password)
    FormHelper.testInputStatus('password')
    cy.getByTestId('passwordConfirmation').focus().type(password)
    FormHelper.testInputStatus('passwordConfirmation')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present EmainInUseError on 403', () => {
    mockEmainInUseError()
    simulateValidSubmit()
    FormHelper.testMainError('Esse e-mail já está em uso')
    Helper.testUrl('/signup')
  })

  it('should save account if valid credentials are provided', () => {
    mockOk()
    simulateValidSubmit()
    cy.getByTestId('main-error').should('not.exist')
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('should prevent multiple submits', () => {
    mockOk()
    populateFields()
    cy.getByTestId('submit').dblclick()
    Helper.testHttpCallsCount(1)
  })

  it('should not call submit if form is invalid', () => {
    mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    Helper.testHttpCallsCount(0)
  })
})
