import React from 'react'
import { makeSignUpValidation } from '@/main/factories/pages/signup/signup-validation-factory'
import { makeLocalUpdateCurrentAccount } from '../../usecases/update-current-account/local-update-current-account-factory'
import { SignUp } from '@/presentation/pages'
import { makeRemoteAddAccount } from '../../usecases/add-account/remote-add-account-factory'

export const makeSignUp: React.FC = () => {
  return (
    <SignUp
      addAccount={makeRemoteAddAccount()}
      validation={makeSignUpValidation()}
      updateCurrentAccount={makeLocalUpdateCurrentAccount()}
    />
  )
}
