import { LoadSurveyList } from '@/domain/usecases'
import { SurveyItem, SurveyItemEmpty } from '@/presentation/pages/survey/components'
import React from 'react'
import Styles from './list-styles.scss'

type Props = {
  surveys: LoadSurveyList.Model[]
}

const List: React.FC<Props> = ({ surveys }: Props) => {
  return (
    <ul data-testid="survey-list" className={Styles.listWrap}>
      { surveys.length
        ? surveys.map((survey: LoadSurveyList.Model) => <SurveyItem key={survey.id} survey={survey}/>)
        : <SurveyItemEmpty/>
      }
    </ul>
  )
}

export default List
