import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Input from '@/presentation/components/input/input'
import Context from '@/presentation/contexts/form/form-context'

const makeSut = (): RenderResult => {
  return render(
    <Context.Provider value={{state: {}}}>
      <Input name="field" />
    </Context.Provider>
 )
}

describe('Input Component', () => {
  test('should begin with readOnly property', () => {
    const sut = makeSut()
    const input = sut.getByTestId('field') as HTMLInputElement

    expect(input.readOnly).toBe(true)
  })
})