import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { usePersistentClickedState } from '../hooks/usePersistentClickedState.hook'
import '../index.css'
import { Type } from '../types'
import { isNotNull } from '../utils'
import { Todo } from './Todo'

type fetchedTodo = Omit<Type.Todo, 'id'> & { id: number }

const LOCAL_STORAGE_KEY = 'TODOS_CLICKED'
const FIFTEEN_SECONDS = 15000 // ms

const fetchTodos = async (): Promise<Type.Todo[]> => {
  return await fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => response.json())
    .then((todos: fetchedTodo[]) =>
      todos.map(({ id, ...todo }) => ({ ...todo, id: id.toString() }))
    )
}

export function Todos(): JSX.Element | null {
  const [fetchedTodos, setTodos] = useState<Type.Todo[] | null>(null)
  const [todos, setSeenTodo] = usePersistentClickedState(
    fetchedTodos,
    LOCAL_STORAGE_KEY,
    FIFTEEN_SECONDS
  )

  useEffect(() => {
    fetchTodos().then(setTodos)
  }, [])

  const onClick = (todo: Type.Todo) => {
    return () => {
      const expirationDate = moment()
        .utc()
        .startOf('minute')
        .add(2, 'minutes')
        .toISOString()
      setSeenTodo(todo.id, expirationDate)
    }
  }

  return isNotNull(todos) ? (
    <section>
      <p>Todos:</p>
      <div className='todos-list'>
        {todos.map((todo) => (
          <Todo key={todo.id} onClick={onClick(todo)} {...todo} />
        ))}
      </div>
    </section>
  ) : null
}
