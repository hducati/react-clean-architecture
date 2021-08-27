import { mockSurveyModel } from '@/domain/test'
import { IconName } from '@/presentation/components'
import { SurveyItem } from '@/presentation/pages/survey/components'
import { render, screen } from '@testing-library/react'
import React from 'react'

const makeSubject = (survey = mockSurveyModel()): void => {
  render(<SurveyItem survey={survey}/>)
}

describe('SurveyItem Component', () => {
  test('should render with correct values', () => {
    const survey = Object.assign(mockSurveyModel(), { didAnswer: true })
    makeSubject(survey)

    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
  })

  test('should render with correct values', () => {
    const survey = Object.assign(mockSurveyModel(), { didAnswer: false })
    makeSubject(survey)

    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
  })
})
