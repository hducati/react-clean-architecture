import { Footer, Header, Loading, Error } from '@/presentation/components'
import { LoadSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import { SurveyResutData } from '@/presentation/pages/survey-result/components'
import React, { useEffect, useState } from 'react'
import Styles from './survey-result-styles.scss'

type Props = {
  loadSurveyResult: LoadSurveyResult
}

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, surveyResult: null, error: error.message }))
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

  return (
    <div className={Styles.surveyResultWrap}>
      <Header/>
      <div data-testid="survey-result" className={Styles.contentWrap}>
        { state.surveyResult && <SurveyResutData surveyResult={state.surveyResult}/>}

        { state.isLoading && <Loading />}
        { state.error && <Error error={state.error} handleReload={handleReload}/>}
      </div>
      <Footer/>
    </div>
  )
}

export default SurveyResult
