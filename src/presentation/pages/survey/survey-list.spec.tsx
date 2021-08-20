import React from 'react'
import { render, screen } from '@testing-library/react'
import { SurveyList } from '@/presentation/pages'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyList } from '@/domain/usecases'

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0

  async loadAll (): Promise<SurveyModel[]> {
    this.callsCount++
    return []
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
  test('should present four empty items on start', () => {
    makeSubject()

    const surveyList = screen.getByTestId('survey-list')

    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
  })

  test('should call LoadSurveyList', () => {
    const { loadSurveyListSpy } = makeSubject()

    expect(loadSurveyListSpy.callsCount).toBe(1)
  })
})
