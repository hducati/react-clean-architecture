import React from 'react';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker';
import 'jest-localstorage-mock'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import Login from './login'
import { AuthenticationSpy, ValidationStub } from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({
  initialEntries: ['/login']
})

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  )

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
  beforeEach(() => {
    localStorage.clear()
  })
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

  test('should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()

    simulateValidSubmit(sut)
    simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({validationError})
    populateEmailField(sut)

    fireEvent.submit(sut.getByTestId('form'))

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error =  new InvalidCredentialsError()
    const errorWrap = sut.getByTestId('error-wrap')

    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(
      Promise.reject(
       error
    ))

    simulateValidSubmit(sut)
    await waitFor(() => errorWrap)

    const mainError = sut.getByTestId('main-error')

    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })

  test('should add accessToken to localstorage on success', async () => {
    const { sut, authenticationSpy } = makeSut()

    simulateValidSubmit(sut)

    await waitFor(() => sut.getByTestId('form'))

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'accessToken', authenticationSpy.account.accessToken
    )
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to signup page', async () => {
    const { sut } = makeSut()
    const signUp = sut.getByTestId('signup')

    fireEvent.click(signUp)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
