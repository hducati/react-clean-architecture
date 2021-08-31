import { FormStatusBase } from '@/presentation/components'
import { useRecoilState } from 'recoil'
import { loginState } from './atoms'
import React from 'react'

const FormStatus: React.FC = () => {
  const [state] = useRecoilState(loginState)

  return (
    <FormStatusBase state={state} />
  )
}

export default FormStatus
