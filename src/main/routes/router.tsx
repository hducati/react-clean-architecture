import React, { memo } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { SurveyList } from '@/presentation/pages'
import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignUp } from '@/main/factories/pages/signup/signup-factory'
import { ApiContext } from '@/presentation/contexts'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters'
import { PrivateRoute } from '@/presentation/components'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider value={{
      setCurrentAccount: setCurrentAccountAdapter,
      getCurrentAccount: getCurrentAccountAdapter
    }}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={makeLogin}/>
          <Route path="/signup" exact component={makeSignUp}/>
          <PrivateRoute path="/" exact component={SurveyList}/>
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default memo(Router)
