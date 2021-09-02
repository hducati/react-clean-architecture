import SignUp from './signup'
import faker from 'faker'
import { fireEvent, waitFor, screen } from '@testing-library/react'
import { Helper, ValidationStub, AddAccountSpy, renderWithHistory } from '@/presentation/test'
import { EmailInUseError } from '@/domain/errors'
import { createMemoryHistory } from 'history'
import { AddAccount } from '@/domain/usecases'

type SubjectTypes = {
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AddAccount.Model) => void
}

type SubjectParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })
const makeSubject = (params?: SubjectParams): SubjectTypes => {
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()

  validationStub.errorMessage = params?.validationError
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    Page: () => SignUp({ validation: validationStub, addAccount: addAccountSpy })
  })

  return {
    addAccountSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField('name', name)
  Helper.populateField('email', email)
  Helper.populateField('password', password)
  Helper.populateField('passwordConfirmation', password)

  const form = screen.getByTestId('form')

  fireEvent.submit(form)

  await waitFor(() => form)
}

describe('SignUp component', () => {
  test('should start with initial state', () => {
    const validationError = faker.random.word()
    makeSubject({ validationError })

    Helper.testStatusForField('name', validationError)
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
    Helper.testStatusForField('passwordConfirmation', validationError)
    expect(screen.getByTestId('submit')).toBeDisabled()
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
  })

  test('should throw name error if Validation fails', () => {
    const validationError = faker.random.word()
    makeSubject({ validationError })
    Helper.populateField('name')
    Helper.testStatusForField('name', validationError)
  })

  test('should throw email error if Validation fails', () => {
    const validationError = faker.random.word()
    makeSubject({ validationError })
    Helper.populateField('email')
    Helper.testStatusForField('email', validationError)
  })

  test('should throw password error if Validation fails', () => {
    const validationError = faker.random.word()
    makeSubject({ validationError })
    Helper.populateField('password')
    Helper.testStatusForField('password', validationError)
  })

  test('should throw password error if Validation fails', () => {
    const validationError = faker.random.word()
    makeSubject({ validationError })
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  test('should show valid name state if Validation success', () => {
    makeSubject()
    Helper.populateField('name')
    Helper.testStatusForField('name')
  })

  test('should show valid email state if Validation success', () => {
    makeSubject()
    Helper.populateField('email')
    Helper.testStatusForField('email')
  })

  test('should show valid password state if Validation success', () => {
    makeSubject()
    Helper.populateField('password')
    Helper.testStatusForField('password')
  })

  test('should show valid passwordConfirmation state if Validation success', () => {
    makeSubject()
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation')
  })

  test('should enable submit button if form is valid', () => {
    makeSubject()
    Helper.populateField('name')
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.populateField('passwordConfirmation')
    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('should show spinner on submit', async () => {
    makeSubject()

    await simulateValidSubmit()

    expect(screen.queryByTestId('spinner')).toBeInTheDocument()
  })

  test('should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSubject()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('should call AddAccount only once', async () => {
    const { addAccountSpy } = makeSubject()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(name, email, password)
    await simulateValidSubmit(name, email, password)

    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words()
    const { addAccountSpy } = makeSubject({ validationError })

    await simulateValidSubmit()

    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('should present error if AddAccount fails', async () => {
    const emailError = new EmailInUseError()
    const { addAccountSpy } = makeSubject()

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(emailError)
    await simulateValidSubmit()

    expect(screen.getByTestId('main-error')).toHaveTextContent(emailError.message)
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
  })

  test('should call UpdateCurrentAccount on success', async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSubject()

    await simulateValidSubmit()

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to login page', async () => {
    makeSubject()
    const loginLink = screen.getByTestId('login-link')

    fireEvent.click(loginLink)

    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/login')
  })
})
