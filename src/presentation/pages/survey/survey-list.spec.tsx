import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SurveyList } from '@/presentation/pages'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyList } from '@/domain/usecases'
import { mockSurveyListModel } from '@/domain/test'
import React from 'react'
import { UnexpectedError } from '@/domain/errors'

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

const makeSubject = (loadSurveyListSpy = new LoadSurveyListSpy()): SubjectTypes => {
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
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()

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
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })

  test('should render error on failure', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)
    makeSubject(loadSurveyListSpy)

    await waitFor(() => screen.getByRole('heading'))
    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })

  test('should call LoadSurveyList on reload', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new UnexpectedError())
    makeSubject(loadSurveyListSpy)

    await waitFor(() => screen.getByRole('heading'))
    fireEvent.click(screen.getByTestId('reload'))

    expect(loadSurveyListSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByRole('heading'))
  })
})
