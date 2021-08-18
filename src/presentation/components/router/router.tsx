import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { SurveyList } from '@/presentation/pages'
import React, { memo } from 'react'

type Factory = {
  makeLogin: React.FC
  makeSignUp: React.FC
}

const Router: React.FC<Factory> = (factory: Factory) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={factory.makeLogin}/>
        <Route path="/signup" exact component={factory.makeSignUp}/>
        <Route path="/" exact component={SurveyList}/>
      </Switch>
    </BrowserRouter>
  )
}

export default memo(Router)
