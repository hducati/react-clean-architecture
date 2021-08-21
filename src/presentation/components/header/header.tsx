import { Logo } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'
import { useHistory } from 'react-router-dom'
import React, { memo, useContext } from 'react'
import Styles from './header-styles.scss'

const Header: React.FC = () => {
  const history = useHistory()
  const { setCurrentAccount } = useContext(ApiContext)
  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault()
    setCurrentAccount(undefined)
    history.replace('/login')
  }

  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span>Henrique</span>
          <a data-testid="logout" href="#" onClick={handleLogout}>Sair</a>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
