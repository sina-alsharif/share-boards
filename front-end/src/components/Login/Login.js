import React, {useState, useContext} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dashboard from '../Dashboard/Dashboard';
import './Login.css';
import { LoginContext } from './LoginContext';
import { UserContext } from './UserContext';

 const LoginForm = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [message, setMessage] = useState("");

   const [logged, setLogged] = useContext(LoginContext);
  
    const {userID1, token1, boards1} = useContext(UserContext);
    const [userID, setuserID] = userID1;
    const [token, setToken] = token1;
    const [boards, setBoards] = boards1;

   const loginHandler = () => {
     const data = {
       email: email,
       password: password
     };
     const options = {
       method: 'POST',
       headers: {
         mode: 'cors',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data)
     };

     fetch('http://localhost:8080/api/users/login', options)
       .then(res => res.json())
       .then(res => {
         if (res.status !== 200) {
           setMessage(res.message)
         } else {
           setMessage("");
           setLogged(true);
           setuserID(res.userID);
           setToken(res.token);
           setBoards(res.boards);
         }
         console.log(res);
       });

     console.log(options);
   }

   const registerHandler = async () => {
     const data = {
       email: email,
       password: password
     };
     const options = {
       method: 'POST',
       headers: {
         mode: 'cors',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data)
     };


     await fetch('http://localhost:8080/api/users/register', options)
       .then(res => res.json())
       .then(res => {
         if (res.status !== 200) {
           setMessage(res.err);
         } else setMessage("Account registered successfully, please login.")
       });
   }


  return (
    <>
      { logged ?  
       <Dashboard email={email} password={password}/> :
       <div className="formContainer">
        <Form>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" placeholder="Enter email" value={email} onChange={event => setEmail(event.target.value)}/>
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" value={password} onChange={event => setPassword(event.target.value)}/>
  </Form.Group>
  <Button className="btn" variant="primary" onClick={loginHandler} >
    Login
  </Button>
  <Button className="btn" variant="info" onClick={registerHandler} >
    Register
  </Button>
  <p className="message">{ message } logged is { logged.toString() } </p>
</Form> 
</div>
 }
 </>
  );
}
 export default LoginForm;