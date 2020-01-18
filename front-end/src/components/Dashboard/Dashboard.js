/* eslint-disable */
import React, {useEffect, useContext, useState} from 'react';
import Cardp from '../Card/Card';
import { UserContext } from '../Login/UserContext';


export default function Dashboard() {

  const [boards, setBoards] = useContext(UserContext);
  const [boardObj, setBoardObj] = useState([]); 

  useEffect(() => { if(boards){
  
    for(var i = 0; i < boards.length; i++){
       var url = `http://localhost:8080/api/boards/${boards[i]}`;
    console.log(url);
    fetch(url)
    .then(res => res.json())
      .then(res => {if(res.data) {setBoardObj(boardObj => [...boardObj, res.data]);}});
    }

    console.log(boardObj);
  }}, [boards]);
  
  return (
    <>
    <div className="tile is-ancestor columns is-mobile is-centered">
    {boardObj.length > 0  &&  boardObj.map(board => <Cardp key={board._id} name={board.name}/>)}
    </div>
    </>
  );
}
