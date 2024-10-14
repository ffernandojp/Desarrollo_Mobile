import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {

  const getToken = async () => {
    const token = await SecureStore.getItemAsync('jwtToken');
    return token;
  };

    const [user, setUser] = useState('');

    return (
        <SessionContext.Provider value={{ user, setUser, getToken }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => React.useContext(SessionContext);