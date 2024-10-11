import React from 'react';
import { Alert, View, Text, Button, StyleSheet, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBalance } from '../context/BalanceContext';
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';

const DepositScreen = () => {
  const [amount, setAmount] = React.useState(0);
  const navigation = useNavigation(); // Access navigation prop
  const { updateBalance } = useBalance(); // Access the balance context

  const { getToken } = useSession();
  
  const handleConfirmDeposit = async () => {
    const token = await getToken();
    // Call your backend API to process the payment here
    fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/deposit`, {
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

        Alert.alert(
          'Confirmation',
          `${data.message}
          \nYour have deposited $${amount} to your Digital Wallet
          \nNow you will be redirected to the home screen ...`,
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
    });
};

  return (
    <View style={styles.container}>
      <Image source={require('../assets/e-wallet.png')} style={styles.logo} />
      <Text style={styles.mainText}>Deposit Money to your Digital Wallet</Text>
      <View style={styles.textContainer}>
      
      <Text style={styles.headerText}>Feel free to deposit any amount to your Digital Wallet</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Amount $</Text>

        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>
      </View>
      <Button style={{marginTop: 20}} title="Confirm" onPress={handleConfirmDeposit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 50,
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  inputContainer: {
    marginTop: 30,
    width: 300
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default DepositScreen;