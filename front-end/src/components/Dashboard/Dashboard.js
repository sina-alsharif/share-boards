/* eslint-disable */
import React, {useEffect, useContext, useState} from 'react';
import Cardp from '../Card/Card';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../Login/UserContext';


export default function Dashboard(props) {

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [userstring, setUserstring] = useState("");

  const {userID1, token1, boards1, boardObj1} = useContext(UserContext);
  const [boardObj, setBoardObj] = boardObj1; 
  const [userID, setuserID] = userID1;
  const [token, setToken] = token1;
  const [boards, setBoards] = boards1;

  const updateBoards = async () => {
    if (boards) {
     await setBoardObj([]);
      for (var i = 0; i < boards.length; i++) {
        var url = `http://localhost:8080/api/boards/${boards[i]}`;
        console.log(url);
        fetch(url)
          .then(res => res.json())
          .then(res => {
            if (res.data) {
              setBoardObj(boardObj => [...boardObj, res.data]);
            }
          });
      }
      console.log(boardObj);
    }
  }
  useEffect(() => {
    updateBoards();
  }, [boards]);

  const addUser = (userEmail, boardID) => {
    const email = userEmail.replace(/\s/g, '');
    console.log(userEmail);
    const options = {
      method: 'POST',
      headers: {
        mode: 'cors',
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({
        user: email
      })
    };

    fetch(`http://localhost:8080/api/boards/${boardID}/addUser`, options)
      .then(res => console.log(res));
    return;
  }

  const addSubmitHandler = async () => {
    if (name) {

      const data = {
        name: name,
        userID: userID
      };
      const options2 = {
        method: 'POST',
        headers: {
          mode: 'cors',
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(data)
      };

      var tempusers = userstring.split(', ');
      
      console.log(userstring, users);
      fetch('http://localhost:8080/api/boards/create', options2)
        .then(res => res.json())
        .then(async res => {
          for (var i = 0; i < tempusers.length; i++) {
            await addUser(tempusers[i], res.data._id);
          }
          setShow(false);
          await setBoards(boards => [...boards, res.data._id]);
          // await setBoardObj(boardObj => [...boardObj, res.data]);
          //await updateBoards();
          setUserstring("");
          setName("");
          console.log(res);
        });
       await setUsers(tempusers);
       console.log(users, tempusers);
      console.log("Added.", options2);
      console.log(boards, userID);
    } else {
      setMessage("Please enter a name.");
    }
  }
  const blank = async () => {await updateBoards()};

  return (
    <>
    <Navbar>
    <Navbar.Brand >Share Boards</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse className="justify-content-end">
      <Navbar.Text>
       <a onClick={() => setShow(true)}><span className="plus">&#43;</span> </a>
      </Navbar.Text>
    </Navbar.Collapse>
  </Navbar>
    <div>
    {boardObj.length > 0  &&  boardObj.map(board => <Cardp key={board._id} name={board.name} users={board.users} board={board} blank={blank} email={props.email}/>)}
    </div>
    <Modal
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal">
            Create a new board
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>

          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label>Users</Form.Label>
            <Form.Control type="input" value={userstring} onChange={(e) => setUserstring(e.target.value)}  placeholder="User1, User2, ..." />
          </Form.Group>
          <Button variant="primary" onClick={addSubmitHandler}>
            Submit
          </Button>

        </Form>
        <p>{message}</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
