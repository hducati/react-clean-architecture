import { SurveyContext } from '@/presentation/pages/survey/components'
import React, { useContext } from 'react'
import Styles from './survey-item-empty-styles.scss'

const Error: React.FC = () => {
  const { state } = useContext(SurveyContext)
  return (
    <div className={Styles.erroWrap}>
      <span data-testid="error">{state.error}</span>
      <button>Recarregar</button>
    </div>
  )
}

export default Error
