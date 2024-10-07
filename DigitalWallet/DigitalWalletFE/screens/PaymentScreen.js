import React from 'react';
import { View, Text, Button } from 'react-native';

const PaymentScreen = ({ route }) => {
  const { amount, transactionID } = route.params;

  const handleConfirmPayment = () => {
    // Call your backend API to process the payment here
    fetch('http://localhost:3001/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, transactionID }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Amount: {amount}</Text>
      <Text>Transaction ID: {transactionID}</Text>
      <Button title="Confirm Payment" onPress={handleConfirmPayment} />
    </View>
  );
};

export default PaymentScreen;