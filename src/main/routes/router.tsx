import React, { memo } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { makeLogin, makeSignUp, makeSurveyList, makeSurveyResult } from '@/main/factories/pages'
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
          <PrivateRoute path="/" exact component={makeSurveyList}/>
          <PrivateRoute path="/surveys/:id" component={makeSurveyResult}/>
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default memo(Router)
