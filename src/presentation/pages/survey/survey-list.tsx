import React, { useEffect, useState } from 'react'
import Styles from './survey-list-styles.scss'
import { Footer, Header, Error } from '@/presentation/components'
import { SurveyContext, SurveyListItem } from '@/presentation/pages/survey/components'
import { LoadSurveyList } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, error: error.message }))
  })

  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: '',
    reload: false
  })

  const handleReload = (): void => setState(old => ({ surveys: [],error: '',reload: !old.reload }))

  useEffect(() => {
    loadSurveyList.loadAll()
      .then(surveys => setState(old => ({ ...old, surveys })))
      .catch(handleError)
  }, [state.reload])

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <SurveyContext.Provider value={{ state, setState }}>
          {state.error
            ? <Error error={state.error} handleReload={handleReload}/>
            : <SurveyListItem/>
          }
        </SurveyContext.Provider>

      </div>
      <Footer/>
    </div>
  )
}

export default SurveyList
