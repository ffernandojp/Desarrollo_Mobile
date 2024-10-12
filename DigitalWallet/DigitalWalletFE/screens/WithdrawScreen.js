import React from 'react';
import { Alert, View, Text, Button, StyleSheet, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBalance } from '../context/BalanceContext';
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';
import { useTransactions } from '../context/TransactionsContext';
import generateRandomId from '../hooks/generateRandomID';

const WithdrawScreen = () => {
  const [amount, setAmount] = React.useState(0);
  const navigation = useNavigation(); // Access navigation prop
  const { updateBalance } = useBalance(); // Access the balance context

  const { getToken } = useSession();

  const { addTransaction } = useTransactions();

  
  const handleConfirmWithdraw = async () => {
     // Validate amount
     const parsedAmount = parseFloat(amount);
     if (isNaN(parsedAmount) || parsedAmount <= 0) {
         Alert.alert(
             'Invalid Amount',
             'Please enter a valid amount greater than zero.',
             [{ text: 'OK' }],
             { cancelable: false }
         );
         return; // Exit the function if the amount is invalid
     }
    const transactionID = generateRandomId();
    const token = await getToken();
    // Call your backend API to process the payment here
    fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    })
    .then(response => {
        console.log('Response Status:', response.status);
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        updateBalance();

        let message = ""
        console.log(data)
        if (data.status === 'success') {
          addTransaction({transactionID, amount, status: 'success', type: 'withdraw'});
          message = `${data.message}
          \nYour have withdrawn $${amount} from your Digital Wallet
          \nNow you will be redirected to the home screen ...`
        } else
        {
          message = `${data.message}`
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
        addTransaction({transactionID, amount, status: 'failed', type: 'withdraw'});
        const errorMessage = error.message ? error.message : 'Something went wrong. Please try again.';
        Alert.alert(
          'Confirmation',
          `${errorMessage}`,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ],
          { cancelable: false } // Optional: Prevents dismissing by tapping outside
        );
    });
};

  return (
    <View style={styles.container}>
      <Image source={require('../assets/e-wallet.png')} style={styles.logo} />
      <Text style={styles.mainText}>Withdraw Money from your Digital Wallet</Text>
      <View style={styles.textContainer}>
      
        <Text style={styles.headerText}>Feel free to withdraw any amount from your Digital Wallet</Text>
        <View style={styles.writeContainer}>
          <Text style={styles.title}>Amount $</Text>
          <View style={styles.inputContainer}>          
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>$</Text>

            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      <Button style={{marginTop: 20}} title="Confirm" onPress={handleConfirmWithdraw} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 50,
      marginBottom: 200
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
    fontSize: 18,
    fontWeight: "semibold",
    marginBottom: 3,
    textAlign: "left",
  },
  subText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '95%',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeContainer: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default WithdrawScreen;