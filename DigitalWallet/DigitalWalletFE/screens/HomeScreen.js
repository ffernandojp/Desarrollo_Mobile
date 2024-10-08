import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useBalance } from '../context/BalanceContext';

const HomeScreen = ({ navigation }) => {
  
  const { balance, updateBalance } = useBalance();
  
  React.useEffect(() => {
    updateBalance();
  }, [balance]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome again to Digital Wallet</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceContainer.title}>Your current balance is:</Text>
        <Text style={styles.balanceContainer.balance}>${balance}</Text>
      </View>
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
  balanceContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
    title: {
      fontSize: 20,
      fontWeight: "semibold",
      marginBottom: 3,
      textAlign: "center",
    },
    balance: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: "blue",
      textAlign: "center",
    },
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