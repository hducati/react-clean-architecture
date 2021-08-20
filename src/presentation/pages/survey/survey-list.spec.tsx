import { render, screen, waitFor } from '@testing-library/react'
import { SurveyList } from '@/presentation/pages'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyList } from '@/domain/usecases'
import { mockSurveyListModel } from '@/domain/test'
import React from 'react'

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0
  surveys = mockSurveyListModel()

  async loadAll (): Promise<SurveyModel[]> {
    this.callsCount++
    return this.surveys
  }
}

type SubjectTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSubject = (): SubjectTypes => {
  const loadSurveyListSpy = new LoadSurveyListSpy()
  render(
    <SurveyList
      loadSurveyList={loadSurveyListSpy}
    />
  )

  return {
    loadSurveyListSpy
  }
}

describe('SurveyList Component', () => {
  test('should present four empty items on start', async () => {
    makeSubject()

    const surveyList = screen.getByTestId('survey-list')

    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
    await waitFor(() => surveyList)
  })

  test('should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSubject()

    expect(loadSurveyListSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByRole('heading'))
  })

  test('should render SurveyItems on success', async () => {
    makeSubject()

    const surveyList = screen.getByTestId('survey-list')

    await waitFor(() => surveyList)
    expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(3)
  })
})
