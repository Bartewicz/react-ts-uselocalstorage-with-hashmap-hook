import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Todo } from './Todo'
import { useLocalClickedState } from '../hooks/useLocalClickedState.hook'
import { isNotNull } from '../utils'
import { Type } from '../types'

const LOCAL_STORAGE_KEY = 'TODOS_CLICKED';
const FIFTEEN_SECONDS = 15000 // ms

const fetchTodos = async (): void => {
  return await fetch('https://jsonplaceholder.typicode.com/todos').then(response => response.json())
}

export function Todos(): JSX.Element {
  const [fetchedTodos, setTodos] = useState<Type.Todo|null>(null)
  const [todos, setSeenTodo] = useLocalClickedState(fetchedTodos, LOCAL_STORAGE_KEY, FIFTEEN_SECONDS)

  useEffect(() => {
    fetchTodos().then(setTodos)
  }, [])

  const onClick = (todo: Type.Todo) => {
    return () => {
      const expirationDate = moment().utc().startOf('minute').add(2, 'minutes').toISOString()
      setSeenTodo(todo.id, expirationDate)
    }
  }

  return isNotNull(todos) ? (
    <section>
      <p>Todos:</p>
      <div className={'todos-list'}>
        {todos.map(todo => <Todo key={todo.id} onClick={onClick(todo)} {...todo} />)}
      </div>
    </section>
  ) : null
}
