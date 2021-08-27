import React from 'react'
import Styles from './error-styles.scss'

type Props = {
  error: string
  handleReload: () => void
}

const Error: React.FC<Props> = ({ error, handleReload }: Props) => {
  return (
    <div className={Styles.errorWrap}>
      <span data-testid="error">{error}</span>
      <button data-testid="reload" onClick={handleReload}>Tentar novamente</button>
    </div>
  )
}

export default Error
