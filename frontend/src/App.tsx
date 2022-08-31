import React from 'react';
import logo from './logo.svg';
import './App.css';
import {RegisterUserRequest} from 'types';

function App() {
  const tmp: RegisterUserRequest = {
    name: 'a',
    surname: 'b',
    email: 'email',
    password: 'pass',
  }

  return (
      <>
        <h1>Test frontu</h1>
        <p>{tmp.name}</p>
      </>
  );
}

export default App;
