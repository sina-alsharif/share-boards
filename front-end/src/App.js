import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './components/Login/Login';
import 'bulma/css/bulma.css';
//import './App.sass';
import {LoginProvider } from './components/Login/LoginContext';
import {UserProvider } from './components/Login/UserContext';

function App() {
  return (
    <LoginProvider>
    <UserProvider>
    <div className="App">
      <link
  rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
  crossOrigin="anonymous"
/>
        <LoginForm/>
    </div>
    </UserProvider>
    </LoginProvider>
  );
}

export default App;
