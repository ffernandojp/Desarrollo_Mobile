import React from 'react';
import { View, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';


const QRScannerScreen = ({ navigation }) => {
  const onSuccess = (e) => {
    const urlParams = new URLSearchParams(e.data.split('?')[1]);
    const amount = urlParams.get('amount');
    const transactionID = urlParams.get('transactionID');

    // Navigate to the Payment screen with the extracted parameters
    navigation.navigate('Payment', { amount, transactionID });
  };

  return (
    <View style={{ flex: 1 }}>
      <QRCodeScanner
        onRead={onSuccess}
        topContent={<Text>Scan your QR Code</Text>}
        bottomContent={<Text>Point your camera at the QR code</Text>}
      />
    </View>
  );
};

export default QRScannerScreen;