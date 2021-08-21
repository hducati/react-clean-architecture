import { SurveyContext } from '@/presentation/pages/survey/components'
import React, { useContext } from 'react'
import Styles from './error-styles.scss'

const Error: React.FC = () => {
  const { state, setState } = useContext(SurveyContext)

  const handleReload = (): void => {
    setState({ surveys: [], errors: '', reload: !state.reload })
  }

  return (
    <div className={Styles.erroWrap}>
      <span data-testid="error">{state.error}</span>
      <button data-testid="reload" onClick={handleReload}>Tentar novamente</button>
    </div>
  )
}

export default Error
