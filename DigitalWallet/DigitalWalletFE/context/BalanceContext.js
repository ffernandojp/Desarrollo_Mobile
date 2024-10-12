import React, { createContext, useState } from 'react';
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
    const [balance, setBalance] = useState(0.00); 

    const { getToken } = useSession();

    const updateBalance = async () => {
      const token = await getToken();
      fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/get-balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setBalance(parseFloat(data.balance));
      })
    };

    return (
        <BalanceContext.Provider value={{ balance, updateBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalance = () => React.useContext(BalanceContext);