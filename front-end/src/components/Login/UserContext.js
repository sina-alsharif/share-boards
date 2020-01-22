import React, {useState, createContext} from 'react';

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [userID, setuserID] = useState();
    const [token, setToken] = useState();
    const [boards, setBoards] = useState();

    return(
        <UserContext.Provider value={{userID1: [userID, setuserID], token1: [token, setToken], boards1: [boards, setBoards]}}> 
            {props.children}
        </UserContext.Provider>
    )
}