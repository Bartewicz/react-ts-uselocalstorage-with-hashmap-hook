import React from 'react'
import { Header } from './components/Header'
import { Todos } from './components/Todos'

export function App(): JSX.Element {
  return (
    <div>
      <Header />
      <Todos />
    </div>
  )
}
