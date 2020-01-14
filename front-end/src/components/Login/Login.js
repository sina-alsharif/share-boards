import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Login.css';

 const LoginForm = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");


   const submitHandler = () => {
   const data = {email: email, password: password};
    const options = {
      method: 'POST',
      headers: {
        mode: 'cors',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
    console.log(options);

    fetch('http://localhost:8080/api/users/login', options)
    .then(res => { console.log(res) })

   }

  //  const submitHandler = () => {
  //    axios.post('http://localhost:3001/api/users/login', {email: email, password: password}, { 'Content-Type': 'application/json' } )
  //    .then(res => console.log(res))
  //    .then(err => console.log(err));
  //  }
  return (
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
  {/* <Form.Group controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Check me out" />
  </Form.Group> */}
  <Button variant="primary" onClick={submitHandler} >
    Submit
  </Button>
</Form>
    </div>
  );
}
 export default LoginForm;