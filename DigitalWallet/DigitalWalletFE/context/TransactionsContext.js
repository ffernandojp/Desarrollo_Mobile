import React, { createContext, useState } from 'react';
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';

const transactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]); 

    const { getToken } = useSession();

    const getTransactions = async () => {
      const token = await getToken();
      fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/get-transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.transactions) setTransactions(data.transactions);
      })
    };

    const addTransaction = async (params = {}) => {
      const { amount, transactionID, status, id } = params;
      const token = await getToken();
      fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/add-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amount, transactionID: transactionID, status: status, type: 'transfer', id: id }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.transactions) setTransactions(data.transactions);
      })
    };

    return (
        <transactionsContext.Provider value={{ transactions, addTransaction, getTransactions }}>
            {children}
        </transactionsContext.Provider>
    );
};

export const useTransactions = () => React.useContext(transactionsContext);