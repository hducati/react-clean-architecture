import React, { memo } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { makeLogin, makeSignUp, makeSurveyList, makeSurveyResult } from '@/main/factories/pages'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters'
import { currentAccountState, PrivateRoute } from '@/presentation/components'
import { RecoilRoot } from 'recoil'

const Router: React.FC = () => {
  const state = {
    setCurrentAccount: setCurrentAccountAdapter,
    getCurrentAccount: getCurrentAccountAdapter
  }

  return (
    <RecoilRoot initializeState={(snapshot) => snapshot.set(currentAccountState, state)}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={makeLogin}/>
          <Route path="/signup" exact component={makeSignUp}/>
          <PrivateRoute path="/" exact component={makeSurveyList}/>
          <PrivateRoute path="/surveys/:id" component={makeSurveyResult}/>
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default memo(Router)
