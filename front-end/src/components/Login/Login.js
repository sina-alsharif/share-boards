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
   const [regis, setRegis] = useState(false);

   const [logged, setLogged] = useContext(LoginContext);
  
    const {userID1, token1, boards1} = useContext(UserContext);
    const [userID, setuserID] = userID1;
    const [token, setToken] = token1;
    const [boards, setBoards] = boards1;

   const submitHandler = () => {
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

     console.log(options);
     if (regis === true) {
       fetch('http://localhost:8080/api/users/register', options)
         .then(res => {
           console.log(res);
           if (res.status !== 200) {
             setMessage("Email or password is in incorrect format")
           } else setMessage("Account registered successfully, please login.")
         });
     } else {
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
     }
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
  <Button className="btn" variant="primary" onClick={() => { setRegis(() => false); submitHandler();}} >
    Login
  </Button>
  <Button className="btn" variant="info" onClick={() => {setRegis(() => true); submitHandler();}} >
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