import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { LoadSurveyResultSpy, mockAccountModel, mockSurveyResultModel, SaveSurveyResultSpy } from '@/domain/test'
import { ApiContext } from '@/presentation/contexts'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import React from 'react'
import SurveyResult from './survey-result'

type SubjectTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

type SubjectParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy
  saveSurveyResultSpy?: SaveSurveyResultSpy
}

const makeSubject = ({
  loadSurveyResultSpy = new LoadSurveyResultSpy(),
  saveSurveyResultSpy = new SaveSurveyResultSpy()
}: SubjectParams = {}): SubjectTypes => {
  const history = createMemoryHistory({ initialEntries: ['/', '/surveys/any_id'], initialIndex: 1 })
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{
      setCurrentAccount: setCurrentAccountMock,
      getCurrentAccount: () => mockAccountModel()
    }}>
        <Router history={history}>
          <SurveyResult
            loadSurveyResult={loadSurveyResultSpy}
            saveSurveyResult={saveSurveyResultSpy}
          />
        </Router>
    </ApiContext.Provider>
  )

  return {
    loadSurveyResultSpy,
    saveSurveyResultSpy,
    history,
    setCurrentAccountMock
  }
}

describe('SurveyResult Component', () => {
  test('should present correct initial state', async () => {
    makeSubject()

    const surveyResult = screen.getByTestId('survey-result')

    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()

    await waitFor(() => surveyResult)
  })

  test('should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSubject()

    await waitFor(() => screen.getByTestId('survey-result'))
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  test('should present SurveyResult data on success', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2020-01-10T00:00:00')
    })

    loadSurveyResultSpy.surveyResult = surveyResult
    makeSubject({ loadSurveyResultSpy })

    await waitFor(() => screen.getByTestId('survey-result'))

    const images = screen.queryAllByTestId('image')
    const answers = screen.queryAllByTestId('answer')
    const percents = screen.queryAllByTestId('percent')
    const answerWrap = screen.queryAllByTestId('answer-wrap')

    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
    expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question)
    expect(screen.getByTestId('answers').childElementCount).toBe(2)
    expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image)
    expect(images[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
    expect(images[1]).toBeFalsy()
    expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer)
    expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer)
    expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
    expect(percents[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`)
    expect(answerWrap[0]).toHaveClass('active')
    expect(answerWrap[1]).not.toHaveClass('active')
  })

  test('should render error on UnexpectedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
    makeSubject({ loadSurveyResultSpy })

    await waitFor(() => screen.getByTestId('survey-result'))
    expect(screen.queryByTestId('question')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })

  test('should logout on AccessDeniedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new AccessDeniedError())
    const { history, setCurrentAccountMock } = makeSubject({ loadSurveyResultSpy })

    await waitFor(() => screen.getByTestId('survey-result'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('should call LoadSurveyList on reload', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new UnexpectedError())
    makeSubject({ loadSurveyResultSpy })

    await waitFor(() => screen.getByTestId('survey-result'))
    fireEvent.click(screen.getByTestId('reload'))

    expect(loadSurveyResultSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByTestId('survey-result'))
  })

  test('should call LoadSurveyList on back button click', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const { history } = makeSubject({ loadSurveyResultSpy })

    await waitFor(() => screen.getByTestId('survey-result'))
    fireEvent.click(screen.getByTestId('back-button'))

    expect(history.location.pathname).toBe('/')
    await waitFor(() => screen.getByTestId('survey-result'))
  })

  test('should not present Loading on active answer click', async () => {
    makeSubject()
    await waitFor(() => screen.getByTestId('survey-result'))

    const answerWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answerWrap[0])

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('should call SaveSurveyResult on non active answer click', async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = makeSubject()
    await waitFor(() => screen.getByTestId('survey-result'))

    const answerWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answerWrap[1])

    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(saveSurveyResultSpy.params).toEqual({
      answer: loadSurveyResultSpy.surveyResult.answers[1].answer
    })
    await waitFor(() => screen.getByTestId('survey-result'))
  })
})
