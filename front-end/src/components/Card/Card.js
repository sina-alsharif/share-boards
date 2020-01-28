/* eslint-disable */
import React, {useState, useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import './Card.css';
import Spinner from 'react-bootstrap/Spinner';
import { UserContext } from '../Login/UserContext';

export default function Cardp(props) {

  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const {userID1, token1, boardObj1, boards1} = useContext(UserContext);
  const [boards, setBoards] = boards1;
  const [boardObj, setBoardObj] = boardObj1; 
  const [userID, setuserID] = userID1;
  const [token, setToken] = token1;

  const fetchUser = async (userID) => {
    var url = `http://localhost:8080/api/users/${userID}`;
    var resp;
    await fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          console.log("Email data: " + res.data.email);
          resp = res;
        }
      });
    return resp.data.email;
  }

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const divClickHandler = async () => {
 setLoading(true);
  if (users.length === 0) {
    for (var i = 0; i < props.board.users.length; i++) {
      var email = await fetchUser(props.board.users[i]);
      await wait(500);
      if (email) setUsers(users => [...users, email]);
      console.log(email);
    }
  }
  if (admins.length === 0) {
    for (var j = 0; j < props.board.admins.length; j++) {
      var email = await fetchUser(props.board.admins[j]);
      await wait(500);
      if (email) setAdmins(admins => [...admins, email]);
      console.log(email);
    }
  }
  console.log(props.board.admins, admins, props.board.users, users);
  setShow(true);
  setLoading(false);
}

const deleteClickHandler = () => {
  const options = {
    method: 'DELETE',
    headers: {
      mode: 'cors',
      'Content-Type': 'application/json',
      'auth-token': token
    }
  };
  const url = `http://localhost:8080/api/boards/${props.board._id}/delete`;
  console.log(url);
  fetch(url, options)
  .then(async res => {if(res.status === 200){
    setShow(false);
    
    var arr = boards;
    const index = arr.indexOf(props.board._id);
    if(index > -1){
      arr.splice(index, 1);
      await setBoards(arr);
      await props.blank();
    }
  }});
}

const deleteUserHandler = async (user) => {
  const data = {user: user}
  const options = {
    method: 'DELETE',
    headers: {
      mode: 'cors',
      'Content-Type': 'application/json',
      'auth-token': token
    },
    body: JSON.stringify(data)
  };
  const url = `http://localhost:8080/api/boards/${props.board._id}/deleteUser`;
  fetch(url, options)
  .then(async res => {if(res.status === 200){
    setShow(false);
    await props.blank();
  }
console.log(res)});
}

  return (
    <div className="column">
         <div className="cardcustom" onClick={divClickHandler}>
            <h1>{props.name}</h1>
           { loading && <Spinner className="spinner" animation="border" role="status">
              <span className="sr-only">Loading...</span>
  </Spinner> }
    </div>
    <Modal
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal">
            {props.name}
          </Modal.Title>
          <a className="delbtn" onClick={deleteClickHandler}><i className="fa fa-trash"></i> Delete</a>
        </Modal.Header>
        <Modal.Body>
        Admins: 
          <div className="nameList">
  {admins.map(admin => <li key={admin.toString()}> {admin} { admin !== props.email && admins.indexOf(props.email) > -1 && <i className="fa fa-user-times removeUser"></i>} </li>)}
          </div>
          Users: 
          <div className="nameList">
  {users.map(user => <li key={user.toString()}> { user } {user != props.email && admins.indexOf(props.email) > -1 && <i className="fa fa-user-times removeUser" onClick={() => deleteUserHandler(user)}></i>}</li>)}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
