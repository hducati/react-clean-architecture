import React from 'react';
import faker from 'faker';
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import { AuthenticationSpy, ValidationStub } from '@/presentation/test';

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />)

  return {
    sut,
    authenticationSpy
  }
}

const simulateValidSubmit = (
  sut: RenderResult, 
  email = faker.internet.email(),
  password = faker.internet.password(),
): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)

  const submitButton = sut.getByTestId('submit')
 
  fireEvent.click(submitButton)
}

const populateEmailField = (
  sut: RenderResult, 
  email = faker.internet.email(),
): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email}})
}

const populatePasswordField = (
  sut: RenderResult, 
  password = faker.internet.password(),
): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password}})
}

const simulateStatusForField = (
  sut: RenderResult, 
  fieldName: string, 
  validationError?: string
): void => {
  const emailStatus = sut.getByTestId(`${fieldName}-status`)
  expect(emailStatus.title).toBe(validationError || 'Tudo certo!')
  expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🔵')
}

describe('Login component', () => {
  afterEach(cleanup)

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({validationError})
    const errorWrap = sut.getByTestId('error-wrap')
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement

    simulateStatusForField(sut, 'email', validationError)
    simulateStatusForField(sut, 'password', validationError)

    expect(errorWrap.childElementCount).toBe(0)
    expect(submitButton.disabled).toBe(true)
  })

  test('should show email error Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({validationError})

    populateEmailField(sut)
    simulateStatusForField(sut, 'email', validationError)
  })

  test('should show password error Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({validationError})

    populatePasswordField(sut)
    simulateStatusForField(sut, 'password', validationError)
  })

  test('should show valid password state if Validation success', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)

    simulateStatusForField(sut, 'password')
  })

  test('should show valid email state if Validation success', () => {
    const { sut } = makeSut()
    populateEmailField(sut)

    simulateStatusForField(sut, 'email')
  })

  test('should enabled submit button if form is valid', () => {
    const { sut } = makeSut()

    populateEmailField(sut)
    populatePasswordField(sut)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
  
    expect(submitButton.disabled).toBe(false)
  })

  test('should show spinner on submit', () => {
    const { sut } = makeSut()

    simulateValidSubmit(sut)

    const spinner = sut.getByTestId('spinner')

    expect(spinner).toBeTruthy()
  })

  test('should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
})