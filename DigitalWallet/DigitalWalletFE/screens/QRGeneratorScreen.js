import React from 'react';
import { Alert, View, Text, Button, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';
import { useTransactions } from '../context/TransactionsContext';
import generateRandomId from '../hooks/generateRandomID';


const QRGeneratorScreen = () => {
    const navigation = useNavigation(); // Access navigation prop
    const [text, onChangeText] = React.useState('');
    const [amount, onChangeAmount] = React.useState(0);
    const [transactionID, setTransactionID] = React.useState(0.00)
    // const [amount, onChangeAmount] = React.useState('')

    const { getToken } = useSession();

    const { addTransaction } = useTransactions();

    const handleGenerateQR = async () => {
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
      const token = await getToken();

      // Call your backend API to generate QR here
      fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/generate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token here
        },
        body: JSON.stringify({ amount, transactionID }),
      })
        .then(response => {if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      // console.log('Response:', response.url);
      return response.json();
        }).then(data => {
          addTransaction({transactionID, amount, status: 'pending', type: 'transfer' });
          const qrCodeUrl = data.qrCode;
          Alert.alert(
            'Confirmation',
            `QR code has been generated successfully!
            \nYou can share it with your friends!`,
            [
              {
                text: 'Cancel',
                // onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {// Navigate to QR Code display screen with the QR code URL
                  navigation.navigate('QRCodeDisplay', { qrCodeUrl: qrCodeUrl });},
              },
            ],
            { cancelable: false } // Optional: Prevents dismissing by tapping outside
          )  
        })
    .catch(error => {
          addTransaction({transactionID, amount, status: 'failed', type: 'transfer' });
          console.error('Error:', error);
          Alert.alert('Error', 'Failed to generate QR code: ' + error.message);
        });
    };

    React.useEffect(() => {
        const id = generateRandomId();
        setTransactionID(id);
    }, [])

      
    return (
      <View style={{ padding: 20 }}>
        <Text style={styles.mainText}>QR Generator</Text>
    <SafeAreaView style={styles.safearea}>
    <Text  style = {styles.headerText}>Transaction ID</Text>
    <View style={styles.inputContainer}>
      <Text style={{fontSize: 16, fontWeight: 'bold'}}>ID</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={`${transactionID}`}
        editable={false}
      />
    </View>
      <Text  style = {styles.headerText}>Amount $</Text>
      <View style={styles.inputContainer}>
      <Text style={{fontSize: 16, fontWeight: 'bold'}}>$</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeAmount}
        value={parseFloat(amount)}
        keyboardType="numeric"
        placeholder='0.00'
      />
    </View>
      
    </SafeAreaView>
        <Button title="Generate QR" style={styles.button} onPress={handleGenerateQR} />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent:'space-around',
    marginBottom: 20,
    gap: 25
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '95%',
  },
  headerText: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    padding:20,
    marginTop: 20
  },
  safearea: {
    marginBottom: 20
  },
  mainText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 30
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default QRGeneratorScreen;