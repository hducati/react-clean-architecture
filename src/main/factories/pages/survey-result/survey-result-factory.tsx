import { SurveyResult } from '@/presentation/pages'
import { makeRemoteLoadSurveyResult } from '@/main/factories/usecases'
import { useParams } from 'react-router-dom'
import React from 'react'

type Props = {
  id: string
}

export const makeSurveyResult: React.FC = () => {
  const { id } = useParams<Props>()
  return (
    <SurveyResult
      loadSurveyResult={makeRemoteLoadSurveyResult(id)}
    />
  )
}
