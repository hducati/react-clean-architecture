import { mockAccountModel } from '@/domain/test'
import { ApiContext } from '@/presentation/contexts'
import { render, screen } from '@testing-library/react'
import React from 'react'
import SurveyResult from './survey-result'

describe('SurveyResult Component', () => {
  test('should present correct initial state', () => {
    render(
      <ApiContext.Provider value={{
        setCurrentAccount: jest.fn(),
        getCurrentAccount: () => mockAccountModel()
      }}>
          <SurveyResult />
      </ApiContext.Provider>
    )

    const surveyResult = screen.getByTestId('survey-result')

    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })
})
