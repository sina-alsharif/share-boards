import React, {useState, useContext} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './components/Login/Login';
import {LoginProvider} from './components/Login/LoginContext';

function App() {

 // const [logged, setLogged] = useContext(LoginProvider);

  return (
    <LoginProvider>
    <div className="App">
      <link
  rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
  crossOrigin="anonymous"
/>
      <LoginForm/>
     
    </div>
    </LoginProvider>
  );
}

export default App;
