import SignUp from './signup'
import React from 'react'
import faker from 'faker'
import { RenderResult, render, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { Helper, ValidationStub, AddAccountSpy, UpdateCurrentAccountMock } from '@/presentation/test'
import { EmailInUseError } from '@/domain/errors'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

type SubjectTypes = {
  subject: RenderResult
  addAccountSpy: AddAccountSpy
  updateCurrentAccountMock: UpdateCurrentAccountMock
}

type SubjectParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })
const makeSubject = (params?: SubjectParams): SubjectTypes => {
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()
  const updateCurrentAccountMock = new UpdateCurrentAccountMock()

  validationStub.errorMessage = params?.validationError
  const subject = render(
    <Router history={history}>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
        updateCurrentAccount={updateCurrentAccountMock}
      />
    </Router>
  )

  return {
    subject,
    addAccountSpy,
    updateCurrentAccountMock
  }
}

const simulateValidSubmit = async (
  subject: RenderResult,
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField(subject, 'name', name)
  Helper.populateField(subject, 'email', email)
  Helper.populateField(subject, 'password', password)
  Helper.populateField(subject, 'passwordConfirmation', password)

  const form = subject.getByTestId('form')

  fireEvent.submit(form)

  await waitFor(() => form)
}

describe('SignUp component', () => {
  afterEach(cleanup)

  test('should start with initial state', () => {
    const validationError = faker.random.word()
    const { subject } = makeSubject({ validationError })

    Helper.testChildCount(subject, 'error-wrap', 0)
    Helper.testButtonIsDisabled(subject, 'submit', true)
    Helper.testStatusForField(subject, 'name', validationError)
    Helper.testStatusForField(subject, 'email', validationError)
    Helper.testStatusForField(subject, 'password', validationError)
    Helper.testStatusForField(subject, 'passwordConfirmation', validationError)
  })

  test('should throw name error if Validation fails', () => {
    const validationError = faker.random.word()
    const { subject } = makeSubject({ validationError })
    Helper.populateField(subject, 'name')
    Helper.testStatusForField(subject, 'name', validationError)
  })

  test('should throw email error if Validation fails', () => {
    const validationError = faker.random.word()
    const { subject } = makeSubject({ validationError })
    Helper.populateField(subject, 'email')
    Helper.testStatusForField(subject, 'email', validationError)
  })

  test('should throw password error if Validation fails', () => {
    const validationError = faker.random.word()
    const { subject } = makeSubject({ validationError })
    Helper.populateField(subject, 'password')
    Helper.testStatusForField(subject, 'password', validationError)
  })

  test('should throw password error if Validation fails', () => {
    const validationError = faker.random.word()
    const { subject } = makeSubject({ validationError })
    Helper.populateField(subject, 'passwordConfirmation')
    Helper.testStatusForField(subject, 'passwordConfirmation', validationError)
  })

  test('should show valid name state if Validation success', () => {
    const { subject } = makeSubject()
    Helper.populateField(subject, 'name')
    Helper.testStatusForField(subject, 'name')
  })

  test('should show valid email state if Validation success', () => {
    const { subject } = makeSubject()
    Helper.populateField(subject, 'email')
    Helper.testStatusForField(subject, 'email')
  })

  test('should show valid password state if Validation success', () => {
    const { subject } = makeSubject()
    Helper.populateField(subject, 'password')
    Helper.testStatusForField(subject, 'password')
  })

  test('should show valid passwordConfirmation state if Validation success', () => {
    const { subject } = makeSubject()
    Helper.populateField(subject, 'passwordConfirmation')
    Helper.testStatusForField(subject, 'passwordConfirmation')
  })

  test('should enable submit button if form is valid', () => {
    const { subject } = makeSubject()
    Helper.populateField(subject, 'name')
    Helper.populateField(subject, 'email')
    Helper.populateField(subject, 'password')
    Helper.populateField(subject, 'passwordConfirmation')
    Helper.testButtonIsDisabled(subject, 'submit', false)
  })

  test('should show spinner on submit', async () => {
    const { subject } = makeSubject()
    await simulateValidSubmit(subject)
    Helper.testElementExists(subject, 'spinner')
  })

  test('should call AddAccount with correct values', async () => {
    const { subject, addAccountSpy } = makeSubject()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(subject, name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('should call AddAccount only once', async () => {
    const { subject, addAccountSpy } = makeSubject()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(subject, name, email, password)
    await simulateValidSubmit(subject, name, email, password)

    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words()
    const { subject, addAccountSpy } = makeSubject({ validationError })

    await simulateValidSubmit(subject)

    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('should present errror if AddAccount fails', async () => {
    const emailError = new EmailInUseError()
    const { subject, addAccountSpy } = makeSubject()

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(emailError)
    await simulateValidSubmit(subject)

    Helper.testElementText(subject, 'main-error', emailError.message)
    Helper.testChildCount(subject, 'error-wrap', 1)
  })

  test('should call UpdateCurrentAccount on success', async () => {
    const { subject, addAccountSpy, updateCurrentAccountMock } = makeSubject()

    await simulateValidSubmit(subject)

    expect(updateCurrentAccountMock.account).toEqual(addAccountSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should present error if SaveAccessToken fails', async () => {
    const { subject, updateCurrentAccountMock } = makeSubject()
    const error = new EmailInUseError()

    jest.spyOn(updateCurrentAccountMock, 'save').mockRejectedValueOnce(error)

    await simulateValidSubmit(subject)

    Helper.testElementText(subject, 'main-error', error.message)
    Helper.testChildCount(subject, 'error-wrap', 1)
  })

  test('should go to login page', async () => {
    const { subject } = makeSubject()
    const loginLink = subject.getByTestId('login-link')

    fireEvent.click(loginLink)

    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/login')
  })
})
