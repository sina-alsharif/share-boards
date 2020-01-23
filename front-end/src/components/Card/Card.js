/* eslint-disable */
import React, {useState, useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import './Card.css';
import { UserContext } from '../Login/UserContext';

export default function Cardp(props) {

  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [show, setShow] = useState(false);

  const {userID1, token1, boardObj1} = useContext(UserContext);
  const [boardObj, setBoardObj] = boardObj1; 
  const [userID, setuserID] = userID1;
  const [token, setToken] = token1;

  const fetchUser = async (userID) =>{
    var url = `http://localhost:8080/api/users/${userID}`;
    var resp;
    await fetch(url)
    .then(res => res.json())
    .then(res =>{
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
  console.log(props.board.admins, admins);
  setShow(true);
}

const deleteClickHandler = () => {
  const options = {
    method: 'DELETE',
    headers: {
      mode: 'cors',
      'Content-Type': 'application/json',
    }
  };
  const url = `http://localhost:8080/api/boards/${props.board._id}/delete`;
  console.log(url);
  fetch(url, options)
  .then(res => {if(res.status === 200){
    setShow(false);

    var arr = boardObj;
    
    console.log(boardObj);
    var index = arr.findIndex(b => b._id == props.board._id);
    if(index > -1){
      arr.splice(index, 1);
      setBoardObj(arr);
      console.log(boardObj);
      props.blank();
    }
  }});
}

  return (
    <div className="column">
         <div className="cardcustom" onClick={divClickHandler}>
            <h1>{props.name}</h1>
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
          <p>
            Admins: {admins}
          </p>
          <p>
            Users: {users}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
