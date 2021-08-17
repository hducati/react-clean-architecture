import { fireEvent, RenderResult } from '@testing-library/react'
import faker from 'faker'

export const testChildCount = (
  subject: RenderResult,
  fieldName: string,
  count: number
): void => {
  const elementWrap = subject.getByTestId(fieldName)
  expect(elementWrap.childElementCount).toBe(count)
}

export const testButtonIsDisabled = (
  subject: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = subject.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const testStatusForField = (
  subject: RenderResult,
  fieldName: string,
  validationError: string = ''
): void => {
  const wrap = subject.getByTestId(`${fieldName}-wrap`)
  const field = subject.getByTestId(fieldName)
  const label = subject.getByTestId(`${fieldName}-label`)
  expect(wrap.getAttribute('data-status')).toBe(validationError ? 'invalid' : 'valid')
  expect(field.title).toBe(validationError)
  expect(label.title).toBe(validationError)
}

export const populateField = (
  subject: RenderResult,
  fieldName: string,
  value = faker.random.word()
): void => {
  const input = subject.getByTestId(fieldName)
  fireEvent.input(input, { target: { value: value } })
}

export const testElementExists = (
  subject: RenderResult,
  fieldName: string
): void => {
  const element = subject.getByTestId(fieldName)

  expect(element).toBeTruthy()
}

export const testElementText = (
  subject: RenderResult,
  fieldName: string,
  text: string
): void => {
  const element = subject.getByTestId(fieldName)
  expect(element.textContent).toBe(text)
}
