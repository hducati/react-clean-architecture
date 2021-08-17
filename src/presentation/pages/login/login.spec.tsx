import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, ValidationStub, SaveAccessTokenMock, Helper } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'

type SubjectTypes = {
  subject: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
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
  const saveAccessTokenMock = new SaveAccessTokenMock()
  validationStub.errorMessage = params?.validationError
  const subject = render(
    <Router history={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )

  return {
    subject,
    authenticationSpy,
    saveAccessTokenMock
  }
}

const simulateValidSubmit = async (
  subject: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField(subject, 'email', email)
  Helper.populateField(subject, 'password', password)

  const form = subject.getByTestId('form')

  fireEvent.submit(form)

  await waitFor(() => form)
}

describe('Login component', () => {
  afterEach(cleanup)

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const { subject } = makeSubject({ validationError })

    Helper.testStatusForField(subject, 'email', validationError)
    Helper.testStatusForField(subject, 'password', validationError)
    Helper.testButtonIsDisabled(subject, 'submit', true)
    Helper.testChildCount(subject, 'error-wrap', 0)
  })

  test('should show email error Validation fails', () => {
    const validationError = faker.random.words()
    const { subject } = makeSubject({ validationError })

    Helper.populateField(subject, 'email')
    Helper.testStatusForField(subject, 'email', validationError)
  })

  test('should show password error Validation fails', () => {
    const validationError = faker.random.words()
    const { subject } = makeSubject({ validationError })

    Helper.populateField(subject, 'password')
    Helper.testStatusForField(subject, 'password', validationError)
  })

  test('should show valid password state if Validation success', () => {
    const { subject } = makeSubject()
    Helper.populateField(subject, 'password')

    Helper.testStatusForField(subject, 'password')
  })

  test('should show valid email state if Validation success', () => {
    const { subject } = makeSubject()
    Helper.populateField(subject, 'email')

    Helper.testStatusForField(subject, 'email')
  })

  test('should enabled submit button if form is valid', () => {
    const { subject } = makeSubject()

    Helper.populateField(subject, 'email')
    Helper.populateField(subject, 'password')
    Helper.testButtonIsDisabled(subject, 'submit', false)
  })

  test('should show spinner on submit', async () => {
    const { subject } = makeSubject()

    await simulateValidSubmit(subject)

    Helper.testElementExists(subject, 'spinner')
  })

  test('should call Authentication with correct values', async () => {
    const { subject, authenticationSpy } = makeSubject()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(subject, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('should call Authentication only once', async () => {
    const { subject, authenticationSpy } = makeSubject()

    await simulateValidSubmit(subject)
    await simulateValidSubmit(subject)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSubject({ validationError })
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const { subject, authenticationSpy } = makeSubject()
    const error = new InvalidCredentialsError()

    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(
      Promise.reject(
        error
      ))

    await simulateValidSubmit(subject)

    Helper.testElementText(subject, 'main-error', error.message)
    Helper.testChildCount(subject, 'error-wrap', 1)
  })

  test('should call SaveAccessToken on success', async () => {
    const { subject, authenticationSpy, saveAccessTokenMock } = makeSubject()

    await simulateValidSubmit(subject)

    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should present error if SaveAccessToken fails', async () => {
    const { subject, saveAccessTokenMock } = makeSubject()
    const error = new InvalidCredentialsError()

    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error))

    await simulateValidSubmit(subject)

    Helper.testElementText(subject, 'main-error', error.message)
    Helper.testChildCount(subject, 'error-wrap', 1)
  })

  test('should go to signup page', async () => {
    const { subject } = makeSubject()
    const signUp = subject.getByTestId('signup-link')

    fireEvent.click(signUp)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
