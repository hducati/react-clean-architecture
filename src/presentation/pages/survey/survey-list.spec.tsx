import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SurveyList } from '@/presentation/pages'
import { UnexpectedError } from '@/domain/errors'
import { LoadSurveyListSpy } from '@/domain/test'
import { createMemoryHistory } from 'history'
import React from 'react'
import { ApiContext } from '@/presentation/contexts'
import { Router } from 'react-router-dom'

type SubjectTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSubject = (loadSurveyListSpy = new LoadSurveyListSpy()): SubjectTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <SurveyList
          loadSurveyList={loadSurveyListSpy}
        />
      </Router>
  </ApiContext.Provider>

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
