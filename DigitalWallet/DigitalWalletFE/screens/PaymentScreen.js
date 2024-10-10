import React from 'react';
import { Alert, View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBalance } from '../context/BalanceContext';



const PaymentScreen = ({ route }) => {
  const navigation = useNavigation(); // Access navigation prop
  const { updateBalance } = useBalance(); // Access the balance context
  const { amount, transactionID } = route.params;

  const handleConfirmPayment = () => {
    // Call your backend API to process the payment here
    fetch('http://192.168.100.6:3001/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, transactionID }),
    })
    .then(response => {
        console.log('Response Status:', response.status);
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        updateBalance();

        Alert.alert(
          'Confirmation',
          `${data.message}
          \nTransaction ID: ${transactionID}
          \nNow you will be redirected to the home screen ...`,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => { navigation.navigate('Home'); },
            },
          ],
          { cancelable: false } // Optional: Prevents dismissing by tapping outside
        );
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Payment Confirmation</Text>
      <View style={styles.textContainer}>
      
      <Text style={styles.headerText}>Amount</Text>
      <Text style={styles.subText}>${amount}</Text>
      <Text style={styles.headerText}>Transaction ID</Text>
      <Text style={styles.subText}>{transactionID}</Text>
      </View>
      <Button style={{marginTop: 20}} title="Confirm Payment" onPress={handleConfirmPayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  textContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  mainText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 30
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 3,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    marginBottom: 10,
  }
});

export default PaymentScreen;