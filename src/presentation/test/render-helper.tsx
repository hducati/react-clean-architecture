import React from 'react'
import { Router } from 'react-router-dom'
import { MemoryHistory } from 'history'
import { render } from '@testing-library/react'
import { MutableSnapshot, RecoilRoot, RecoilState } from 'recoil'
import { currentAccountState } from '@/presentation/components'
import { mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'

type Params = {
  Page: React.FC
  history: MemoryHistory
  account?: AccountModel
  states?: Array<{ atom: RecoilState<any>, value: any}>
}

type Result = {
  setCurrentAccountMock: (account: AccountModel) => void
}

export const renderWithHistory = ({
  Page, history, account = mockAccountModel(), states = []
}: Params): Result => {
  const setCurrentAccountMock = jest.fn()
  const mockedState = {
    setCurrentAccount: setCurrentAccountMock,
    getCurrentAccount: () => account
  }

  const handleInitializeState = (snapshot: MutableSnapshot): void => {
    [...states, { atom: currentAccountState, value: mockedState }].forEach(
      state => snapshot.set(state.atom, state.value)
    )
  }

  render(
    <RecoilRoot initializeState={handleInitializeState}>
      <Router history={history}>
        <Page />
      </Router>
    </RecoilRoot>
  )

  return {
    setCurrentAccountMock
  }
}
