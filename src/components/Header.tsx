import React from 'react';

export function Header(): JSX.Element {
  return (
    <div>
      <h1>usePersistentClickedState</h1>
      <p>JavaScript's Map stored in LocalStorage</p>
      <p>Each element clicked has it's state expiration date, state is refreshed frequently.</p>
    </div>
  )
}
