
import React from 'react'
import Spinner from '@/presentation/components/spinner/spinner'
import Styles from '@/presentation/components/loading/loading-styles.scss'

type Props = React.HTMLAttributes<HTMLElement> & {
  isNegative?: boolean
}

const Loading: React.FC<Props> = (props: Props) => {
  return (
    <div className={Styles.loadingWrap}>
      <div className={Styles.loading}>
        <span>Aguarde..</span>
        <Spinner isNegative />
      </div>
  </div>
  )
}

export default Loading
