import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {Camera } from 'expo-camera';
// import { CameraType } from 'expo-camera/legacy';
import QRScanner from '../components/QRScanner';
// import QRScanner from '../components/QRScanner';
const QRScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  // console.log("Facing", CameraType)
  // const [facing, setFacing] = useState(CameraType.back);



  // Request camera permission
  useEffect(() => {
    const requestCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermissions();
  }, []);


  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button title="Grant Permission" onPress={requestCameraPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Camera
        style={StyleSheet.absoluteFill}
        // onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} 
      > */}
    

        <View style={styles.overlay}>
          <Text style={styles.text}>Point your camera at the QR code</Text>
          {/* {scanned && (
            <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
          )} */}
        </View>
      {/* </Camera> */}
      <QRScanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
});

export default QRScannerScreen;