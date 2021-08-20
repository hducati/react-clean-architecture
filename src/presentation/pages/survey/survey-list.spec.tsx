import React from 'react'
import { render, screen } from '@testing-library/react'
import { SurveyList } from '@/presentation/pages'

const makeSubject = (): void => {
  render(
    <SurveyList />
  )
}

describe('SurveyList Component', () => {
  test('should present four empty items on start', () => {
    makeSubject()

    const surveyList = screen.getByTestId('survey-list')

    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
  })
})
