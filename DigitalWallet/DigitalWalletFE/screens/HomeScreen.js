import React from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView } from 'react-native';
import { useBalance } from '../context/BalanceContext';
import { useSession } from '../context/SessionContext';

const HomeScreen = ({ navigation }) => {
  
  const { balance, updateBalance } = useBalance();

  const { user } = useSession();
  
  React.useEffect(() => {
    updateBalance();
  }, [balance]);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/e-wallet.png')} style={styles.logo} />
      {/* <Text style={styles.title}>Welcome again to Digital Wallet</Text> */}
      <View style={styles.userContainer}>
        <Text style={styles.title}>Hi {user}</Text>
        <Text style={styles.subtitleUser}>What would you like to do today?</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceContainer.title}>Your current balance is:</Text>
        <Text style={styles.balanceContainer.balance}>${balance.toFixed(2)}</Text>
      </View>
      <View style={styles.depositContainer}>
        <Text style={styles.subtitle}>See your transactions using the following button:</Text>
        <Button title="Transactions" color={'#47b242'} onPress={() => navigation.navigate('Transactions')} />
      </View>
      <View style={styles.depositContainer}>
        <Text style={styles.subtitle}>Deposit into your wallet using the following button:</Text>
        <Button title="Deposit" color={'#D6A600'} onPress={() => navigation.navigate('Deposit')} />
      </View>
      <View style={styles.withdrawContainer}>
        <Text style={styles.subtitle}>Witdraw from your wallet using the following button:</Text>
        <Button title="Withdraw" color={'#522ab6'} onPress={() => navigation.navigate('Withdraw')} />
      </View>

      <View style={styles.qrContainer}>
        <Text style={styles.subtitle}>Scan QR Code or generate one:</Text>
        <Button title="Scan QR Code" onPress={() => navigation.navigate('QRScanner')} />
        <Button title="Generate QR Code" color={'grey'} onPress={() => navigation.navigate('GenerateQR')} />
      </View>
        
        {/* Footer Section */}
        <View style={styles.footer}>
        <Text style={styles.footerText}>Developed by Fernando Pérez</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#f8f9fa',
  },
  userContainer: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  balanceContainer: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 3,
      textAlign: "center",
    },
    balance: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: "blue",
      textAlign: "center",
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitleUser: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent:'space-around',
    // justifyContent: 'center',
    // flexWrap: 'wrap',
    marginBottom: 18,
    gap: 20
  },
  logo: {
    width: 200,
    height: 200,
  },
  depositContainer: {
    marginVertical: 15
  },
  withdrawContainer: {
    marginVertical: 15
  },
  qrContainer: {
    width: '100%',
    justifyContent: 'space-around',
    height: '20%',
    marginVertical: 15,
    marginBottom: 35
  },
   // Footer styles
  footer: {
    paddingVertical: 10,
    marginTop: 50,
    fontStyle: 'italic',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1', // Light background for contrast
    width: '100%',
    position: 'absolute', 
    bottom: 0 
  },
  footerText:{
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    fontWeight: 'semibold'
  }
});

export default HomeScreen;