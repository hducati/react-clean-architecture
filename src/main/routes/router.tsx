import React, { memo } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { makeLogin, makeSignUp, makeSurveyList, makeSurveyResult } from '@/main/factories/pages'
import { ApiContext } from '@/presentation/contexts'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters'
import { PrivateRoute } from '@/presentation/components'
import { RecoilRoot } from 'recoil'

const Router: React.FC = () => {
  return (
    <RecoilRoot>
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
    </RecoilRoot>
  )
}

export default memo(Router)
