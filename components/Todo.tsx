import React from 'react'
import { TodoWithClickedState } from '../hooks/useLocalClickedState.hook'

interface TodoProps extends TodoWithClickedState {
  onClick: (id: number) => void
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