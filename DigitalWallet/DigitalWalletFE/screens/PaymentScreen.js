import React from 'react';
import { Alert, View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBalance } from '../context/BalanceContext';
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';
import { useTransactions } from '../context/TransactionsContext';


const PaymentScreen = ({ route }) => {
  const navigation = useNavigation(); // Access navigation prop
  const { updateBalance } = useBalance(); // Access the balance context
  const { amount, transactionID, status = null, id = null } = route.params;

  const { getToken } = useSession();

  const { addTransaction } = useTransactions();
  
  const handleConfirmPayment = async () => {
    const token = await getToken();
    // Call your backend API to process the payment here
    fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/process-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, transactionID }),
    })
    .then(response => {
        console.log('Response Status:', response.status);
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        updateBalance();
        
        let message = ""

        if (data.status === 'success') {
          addTransaction({transactionID, amount, status: 'success', type: 'transfer', id: id });
          
          message = `${data.message}
          \nTransaction ID: ${transactionID}
          \nNow you will be redirected to the home screen ...`
        } else {
          message = `${data.message} 
          \nNow you will be redirected to the home screen ...`
        }

        Alert.alert(
          'Confirmation',
          `${message}`,
          [
            {
              text: 'Cancel',
              // onPress: () => console.log('Cancel Pressed'),
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
        addTransaction({transactionID, amount, status: 'failed', type: 'transfer', id: id });
        Alert.alert(
          'Error',
          'Failed to process payment. Please try again later.',
          [
            {
              text: 'OK',
              onPress: () => { navigation.navigate('Home'); },
            },
          ],
          { cancelable: false } // Optional: Prevents dismissing by tapping outside
        );
    });
};

  return (
    <View style={styles.container}>
      <Image source={require('../assets/e-wallet.png')} style={styles.logo} />
      <Text style={styles.mainText}>{status === 'success' ? "Payment Successful" : status === 'failed' ? "Payment Failed" : "Payment Confirmation"}</Text>
      <View style={styles.textContainer}>
      
      <Text style={styles.headerText}>Amount $</Text>
      <Text style={styles.subText}>${amount}</Text>
      <Text style={styles.headerText}>Transaction ID</Text>
      <Text style={styles.subText}>{transactionID}</Text>
      </View>
      {(status === 'pending' || status === null) && <Button style={{marginTop: 20}} title="Confirm Payment" onPress={handleConfirmPayment} />}
      {(status === 'success' || status === 'failed') && <Button style={{marginTop: 20}} title="Go Back" onPress={() => navigation.navigate('Transactions')} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20
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
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});

export default PaymentScreen;