import { FormStatusBase } from '@/presentation/components'
import { useRecoilValue } from 'recoil'
import { loginState } from './atoms'
import React from 'react'

const FormStatus: React.FC = () => {
  const state = useRecoilValue(loginState)

  return (
    <FormStatusBase state={state} />
  )
}

export default FormStatus
