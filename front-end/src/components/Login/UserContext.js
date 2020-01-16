import React, {useState, createContext} from 'react';

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [userID, setuserID] = useState();
    const [token, setToken] = useState();
    return(
        <UserContext.Provider value={[userID, setuserID], [token, setToken]}>
            {props.children}
        </UserContext.Provider>
    )
}