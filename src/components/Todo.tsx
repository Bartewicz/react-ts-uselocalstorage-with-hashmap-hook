import React from 'react'
import { ClickedState } from '../hooks/useLocalClickedState.utils'
import '../index.css'
import { Type } from '../types'

interface TodoProps extends ClickedState, Type.Todo {
  onClick: (id: string) => void
}

export function Todo(props: TodoProps): JSX.Element {
  const onClick = () => props.onClick(props.id)
  const className = props.isClicked ? 'todo clicked' : 'todo'

  return (
    <button className={className} onClick={onClick}>
      {props.title}
    </button>
  )
}
