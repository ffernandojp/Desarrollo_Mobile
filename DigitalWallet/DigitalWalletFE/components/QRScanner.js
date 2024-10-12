import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-camera/legacy';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useTransactions } from '../context/TransactionsContext';


export default function QRScanner() {
  const navigation = useNavigation(); // Access navigation prop
  const { addTransaction } = useTransactions();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    const urlParams = new URLSearchParams(data.split('?')[1]);
    const amount = urlParams.get('amount');
    const transactionID = urlParams.get('transactionID');

    Alert.alert(
        'Confirmation',
        `The QR code has been scanned successfully!
        \nNow you will be redirect to the payment section, do you want to continue?
        `,
        [
          {
            text: 'Cancel',
            // onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {addTransaction({transactionID, amount, status: 'pending', type: 'transfer'}); navigation.navigate('Payment', { amount, transactionID });},
          },
        ],
        { cancelable: false } // Optional: Prevents dismissing by tapping outside
      );
    

  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const urlParams = new URLSearchParams(data.split('?')[1]);
    const amount = urlParams.get('amount');
    const transactionID = urlParams.get('transactionID');

    // Navigate to the Payment screen with extracted parameters
    navigation.navigate('Payment', { amount, transactionID });
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
  >
     {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});