import { SignUp } from '@/presentation/pages'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import React from 'react'

type Props = {
  makeLogin: React.FC
}

const Router: React.FC<Props> = ({ makeLogin }: Props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={makeLogin}/>
        <Route path="/signup" exact component={SignUp}/>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
