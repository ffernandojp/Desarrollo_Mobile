import React, { createContext, useState } from 'react';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
    const [balance, setBalance] = useState(0.00); 

    const updateBalance = () => {
      fetch('http://192.168.100.6:3001/get-balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        setBalance(data.balance);
      })
    };

    return (
        <BalanceContext.Provider value={{ balance, updateBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalance = () => React.useContext(BalanceContext);