import React from 'react';
import { Alert, View, Text, Button, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';


const QRGeneratorScreen = () => {
    const navigation = useNavigation(); // Access navigation prop
    const [text, onChangeText] = React.useState('');
    const [amount, onChangeAmount] = React.useState(0);
    const [transactionID, setTransactionID] = React.useState(0)
    // const [amount, onChangeAmount] = React.useState('')
  
    const handleGenerateQR = () => {
      // Call your backend API to generate QR here
      fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/generate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, transactionID }),
      })
        .then(response => {if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      // console.log('Response:', response.url);
      return response.json();
        }).then(data => {
          const qrCodeUrl = data.qrCode;
          Alert.alert(
            'Confirmation',
            `QR code has been generated successfully!
            \nYou can share it with your friends!`,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
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
          console.error('Error:', error);
        });
    };

    React.useEffect(() => {
        const id = generateRandomId();
        setTransactionID(id);
    }, [])

    function generateRandomId() {
        const min = 1000000000; // Minimum 10-digit number
        const max = 9999999999; // Maximum 10-digit number
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

      
    return (
      <View style={{ padding: 20 }}>
        <Text style={styles.mainText}>QR Generator</Text>
        {/* <Text>Amount: {amount}</Text>
        <Text>Transaction ID: {transactionID}</Text>
        <Button title="Confirm Payment" onPress={handleConfirmPayment} /> */}
    <SafeAreaView style={styles.safearea}>
    <Text  style = {styles.headerText}>Transaction ID</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={`${transactionID}`}
        editable={false}
      />
        <Text  style = {styles.headerText}>Amount</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeAmount}
        value={amount}
        keyboardType="numeric"
      />
      
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
});

export default QRGeneratorScreen;