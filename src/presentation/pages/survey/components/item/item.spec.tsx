import { mockSurveyModel } from '@/domain/test'
import { IconName } from '@/presentation/components'
import { SurveyItem } from '@/presentation/pages/survey/components'
import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

type SubjectTypes = {
  history: MemoryHistory
}

const makeSubject = (survey = mockSurveyModel()): SubjectTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  render(
    <Router history={history}>
      <SurveyItem survey={survey}/>
    </Router>
  )

  return {
    history
  }
}

describe('SurveyItem Component', () => {
  test('should render with correct values', () => {
    const survey = Object.assign(mockSurveyModel(), { didAnswer: true, date: new Date('2020-01-10T00:00:00') })
    makeSubject(survey)

    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
  })

  test('should render with correct values', () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: false, date: new Date('2019-05-03T00:00:00')
    })
    makeSubject(survey)

    expect(screen.getByTestId('day')).toHaveTextContent('03')
    expect(screen.getByTestId('month')).toHaveTextContent('mai')
    expect(screen.getByTestId('year')).toHaveTextContent('2019')
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
  })

  test('should go to SurveyResult', () => {
    const survey = mockSurveyModel()
    const { history } = makeSubject(survey)

    fireEvent.click(screen.getByTestId('link'))

    expect(history.location.pathname).toBe(`/surveys/${survey.id}`)
  })
})
