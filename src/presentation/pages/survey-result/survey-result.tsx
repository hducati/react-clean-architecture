import { Footer, Header, Loading, Error } from '@/presentation/components'
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import { SurveyResultContext, SurveyResutData } from '@/presentation/pages/survey-result/components'
import React, { useEffect, useState } from 'react'
import Styles from './survey-result-styles.scss'

type Props = {
  loadSurveyResult: LoadSurveyResult
  saveSurveyResult: SaveSurveyResult
}

const SurveyResult: React.FC<Props> = ({ loadSurveyResult, saveSurveyResult }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, surveyResult: null, isLoading: false, error: error.message }))
  })

  const [state, setState] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model,
    reload: false
  })

  useEffect(() => {
    loadSurveyResult.load()
      .then(surveyResult => setState(old => ({ ...old, surveyResult: surveyResult })))
      .catch(handleError)
  }, [state.reload])

  const handleReload = (): void => setState(old => (
    { isLoading: false, surveyResult: null, error: '', reload: !old.reload }
  ))

  const onAnswer = (answer: string): void => {
    if (state.isLoading) {
      return
    }

    setState(old => ({ ...old, isLoading: true }))
    saveSurveyResult.save({ answer })
      .then(surveyResult => setState(old => ({ ...old, surveyResult: surveyResult, isLoading: false })))
      .catch(handleError)
  }

  return (
    <div className={Styles.surveyResultWrap}>
      <Header/>
      <SurveyResultContext.Provider value= {{ onAnswer }}>
        <div data-testid="survey-result" className={Styles.contentWrap}>
          { state.surveyResult && <SurveyResutData surveyResult={state.surveyResult}/>}

          { state.isLoading && <Loading />}
          { state.error && <Error error={state.error} handleReload={handleReload}/>}
        </div>
      </SurveyResultContext.Provider>
      <Footer/>
    </div>
  )
}

export default SurveyResult
