import React from 'react';
import { Alert, View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation


const PaymentScreen = ({ route }) => {
  const navigation = useNavigation(); // Access navigation prop
  const { amount, transactionID } = route.params;

  const handleConfirmPayment = ({amount, transactionID}) => {
    // Call your backend API to process the payment here
    fetch('http://192.168.151.26:3001/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, transactionID }),
    })
    .then(response => {
      console.log('Response Status:', response.status);
      return response.text(); // Log the raw text
  })
  .then(text => {
    console.log('Response Text:', text);
    try {
        const data = JSON.parse(text); // Attempt to parse JSON
        console.log('Parsed Data:', data);
        Alert.alert(
          'Confirmation',
          `${data.message}
          \nRedirecting to your banking app...
          `,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {console.log('OK Pressed'); navigation.navigate('Home');},
            },
          ],
          { cancelable: false } // Optional: Prevents dismissing by tapping outside
        );
      } catch (error) {
        console.error('JSON Parse Error:', error);
    }
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