/* eslint-disable */
import React, {useEffect, useContext, useState} from 'react';
import Cardp from '../Card/Card';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../Login/UserContext';


export default function Dashboard(props) {

  const [boardObj, setBoardObj] = useState([]); 
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [userstring, setUserstring] = useState("");
  const [trigger, setTrigger] = useState(false);

  const {userID1, token1, boards1} = useContext(UserContext);
  const [userID, setuserID] = userID1;
  const [token, setToken] = token1;
  const [boards, setBoards] = boards1;


  useEffect(() => {
    if (boards) {

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
  }, [boards]);

  const fetchBoards = () => {
    const data = {
      email: props.email,
      password: props.password
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
        return;
      } else {
        setBoards(res.boards);
      }
      console.log(res);
    });
  }

  const addSubmitHandler = () => {
    if(name){
    setUsers(userstring.split(', '));
    const data = {
      name: name,
      users: users,
      userID: userID
    };
    const options2 = {
      method: 'POST',
      headers: {
        mode: 'cors',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };

    fetch('http://localhost:8080/api/boards/create', options2)
    .then(res => {setShow(false); console.log(res);});
    console.log("Added.", options2);
    console.log(boards, userID);
    fetchBoards();
  }
  else{
    setMessage("Please enter a name.");
  }
  }
  
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
    {boardObj.length > 0  &&  boardObj.map(board => <Cardp key={board._id} name={board.name} users={board.users} board={board}/>)}
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
