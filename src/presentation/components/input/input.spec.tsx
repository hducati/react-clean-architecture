import React from 'react'
import faker from 'faker'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import Input from '@/presentation/components/input/input'
import Context from '@/presentation/contexts/form/form-context'

const makeSubject = (fieldName: string): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </Context.Provider>
  )
}

describe('Input Component', () => {
  test('should begin with readOnly property', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const input = subject.getByTestId(field) as HTMLInputElement

    expect(input.readOnly).toBe(true)
  })

  test('should remove readOnly on focus', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const input = subject.getByTestId(field) as HTMLInputElement

    fireEvent.focus(input)

    expect(input.readOnly).toBe(false)
  })

  test('should focus input on label click', () => {
    const field = faker.database.column()
    const subject = makeSubject(field)
    const input = subject.getByTestId(field)
    const label = subject.getByTestId(`${field}-label`)

    fireEvent.click(label)

    expect(document.activeElement).toBe(input)
  })
})
