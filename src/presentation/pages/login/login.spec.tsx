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

describe('Login component', () => {
  afterEach(cleanup)

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({validationError})
    const errorWrap = sut.getByTestId('error-wrap')
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    const emailStatus = sut.getByTestId('email-status')
    const passwordStatus = sut.getByTestId('password-status')

    expect(errorWrap.childElementCount).toBe(0)
    expect(submitButton.disabled).toBe(true)
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('should show email error Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({validationError})

    const emailInput = sut.getByTestId('email')
    const emailStatus = sut.getByTestId('email-status')

    fireEvent.input(emailInput, { target: { value: faker.internet.email()}})

    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('should show password error Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({validationError})

    const passwordInput = sut.getByTestId('password')
    const passwordStatus = sut.getByTestId('password-status')

    fireEvent.input(passwordInput, { target: { value: faker.internet.password()}})

    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('should show valid password state if Validation success', () => {
    const { sut } = makeSut()

    const passwordInput = sut.getByTestId('password')
    const passwordStatus = sut.getByTestId('password-status')

    fireEvent.input(passwordInput, { target: { value: faker.internet.password()}})

    expect(passwordStatus.title).toBe('Tudo certo!')
    expect(passwordStatus.textContent).toBe('🔵')
  })

  test('should show valid password state if Validation success', () => {
    const { sut } = makeSut()

    const emailInput = sut.getByTestId('email')
    const emailStatus = sut.getByTestId('email-status')

    fireEvent.input(emailInput, { target: { value: faker.internet.email()}})

    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('🔵')
  })

  test('should enabled submit button if form is valid', () => {
    const { sut } = makeSut()

    const emailInput = sut.getByTestId('email')
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    const passwordInput = sut.getByTestId('password')

    fireEvent.input(emailInput, { target: { value: faker.internet.email()}})
    fireEvent.input(passwordInput, { target: { value: faker.internet.password()}})
    
    expect(submitButton.disabled).toBe(false)
  })

  test('should show spinner on submit', () => {
    const { sut } = makeSut()

    const emailInput = sut.getByTestId('email')
    const submitButton = sut.getByTestId('submit')
    const passwordInput = sut.getByTestId('password')

    fireEvent.input(emailInput, { target: { value: faker.internet.email()}})
    fireEvent.input(passwordInput, { target: { value: faker.internet.password()}})
    fireEvent.click(submitButton)

    const spinner = sut.getByTestId('spinner')

    expect(spinner).toBeTruthy()
  })

  test('should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()

    const email = faker.internet.email()
    const password = faker.internet.password()

    const emailInput = sut.getByTestId('email')
    const submitButton = sut.getByTestId('submit')
    const passwordInput = sut.getByTestId('password')

    fireEvent.input(emailInput, { target: { value: email }})
    fireEvent.input(passwordInput, { target: { value: password}})
    fireEvent.click(submitButton)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
})