import React, { Component } from 'react';
import { render } from 'react-dom';
import { Header } from './components/Header';
import { Todos } from './components/Todos';
import './style.css';

function App(): JSX.Element {
  return (
    <div>
      <Header title={'useClickedState from LocalStorage'} />
      <Todos />
    </div>
  );
}

render(<App />, document.getElementById('root'));
