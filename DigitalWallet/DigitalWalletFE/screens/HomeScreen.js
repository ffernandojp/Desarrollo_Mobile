import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Digital Wallet</Text>
      <Text style={styles.subtitle}>Choose an option below:</Text>
      
      <View style={styles.buttons}>

      <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('QRScanner')}
      />
      <Button
        color={'grey'}
        title="Generate QR Code"
        onPress={() => navigation.navigate('GenerateQR')}
      />
      </View>
      
      {/* You can add more buttons for other functionalities here */}
      {/* Example: 
      <Button
        title="View Transactions"
        onPress={() => navigation.navigate('Transactions')}
      />
      */}
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
  }
});

export default HomeScreen;