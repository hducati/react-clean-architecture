import React from 'react'
import faker from 'faker'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { ApiContext } from '@/presentation/contexts'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, ValidationStub, Helper } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { Authentication } from '@/domain/usecases'

type SubjectTypes = {
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: Authentication.Model) => void
}

type SubjectParams = {
  validationError: string
}

const history = createMemoryHistory({
  initialEntries: ['/login']
})

const makeSubject = (params?: SubjectParams): SubjectTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  validationStub.errorMessage = params?.validationError
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <Login
          validation={validationStub}
          authentication={authenticationSpy}
        />
      </Router>
    </ApiContext.Provider>
  )

  return {
    authenticationSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField('email', email)
  Helper.populateField('password', password)

  const form = screen.getByTestId('form')

  fireEvent.submit(form)

  await waitFor(() => form)
}

describe('Login component', () => {
  test('should start with initial state', () => {
    const validationError = faker.random.words()
    makeSubject({ validationError })

    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
    expect(screen.getByTestId('submit')).toBeDisabled()
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
  })

  test('should show email error Validation fails', () => {
    const validationError = faker.random.words()
    makeSubject({ validationError })

    Helper.populateField('email')
    Helper.testStatusForField('email', validationError)
  })

  test('should show password error Validation fails', () => {
    const validationError = faker.random.words()
    makeSubject({ validationError })

    Helper.populateField('password')
    Helper.testStatusForField('password', validationError)
  })

  test('should show valid password state if Validation success', () => {
    makeSubject()

    Helper.populateField('password')
    Helper.testStatusForField('password')
  })

  test('should show valid email state if Validation success', () => {
    makeSubject()

    Helper.populateField('email')
    Helper.testStatusForField('email')
  })

  test('should enabled submit button if form is valid', () => {
    makeSubject()

    Helper.populateField('email')
    Helper.populateField('password')

    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('should show spinner on submit', async () => {
    makeSubject()
    await simulateValidSubmit()

    expect(screen.queryByTestId('spinner')).toBeInTheDocument()
  })

  test('should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSubject()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('should call Authentication only once', async () => {
    const { authenticationSpy } = makeSubject()

    await simulateValidSubmit()
    await simulateValidSubmit()

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSubject({ validationError })
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSubject()
    const error = new InvalidCredentialsError()

    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(
      Promise.reject(
        error
      ))

    await simulateValidSubmit()

    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
  })

  test('should call UpdateCurrentAccount on success', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSubject()

    await simulateValidSubmit()

    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to signup page', async () => {
    makeSubject()
    const signUp = screen.getByTestId('signup-link')

    fireEvent.click(signUp)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
