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
      <Text style={styles.title}>Welcome again to Digital Wallet</Text>
      <View style={styles.userContainer}>
        <Text style={styles.titleUser}>Hi {user}</Text>
        <Text style={styles.subtitleUser}>What would you like to do today?</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceContainer.title}>Your current balance is:</Text>
        <Text style={styles.balanceContainer.balance}>${balance.toFixed(2)}</Text>
      </View>
      <View style={styles.depositContainer}>
        <Text style={styles.subtitle}>Deposit into your wallet using the following button:</Text>
        <Button title="Transactions" color={'#47b242'} onPress={() => navigation.navigate('Transactions')} />
      </View>
      <View style={styles.depositContainer}>
        <Text style={styles.subtitle}>Deposit into your wallet using the following button:</Text>
        <Button title="Deposit" color={'#D6A600'} onPress={() => navigation.navigate('Deposit')} />
      </View>
      <View style={styles.qrContainer}>
        <Text style={styles.subtitle}>Scan QR Code or generate one:</Text>
        <Button title="Scan QR Code" onPress={() => navigation.navigate('QRScanner')} />
        <Button title="Generate QR Code" color={'grey'} onPress={() => navigation.navigate('GenerateQR')} />
      </View>
      {/* <View style={styles.depositContainer}>
        <Text style={styles.subtitle}>Deposit into your wallet using the following button:</Text>
      </View> */}
      
      {/* <View style={styles.buttons}>
      <Button title="Deposit" color={'#D6A600'} onPress={() => navigation.navigate('Deposit')} />

      <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('QRScanner')}
      />
      
      <Button
        color={'grey'}
        title="Generate QR Code"
        onPress={() => navigation.navigate('GenerateQR')}
      />
      </View> */}
      {/* <View style={styles.buttonLogoutContainer}>

        <Button title="Logout" color={'red'} onPress={() => navigation.navigate('Login')} />
      </View> */}
      
      {/* Example: 
      <Button
        title="View Transactions"
        onPress={() => navigation.navigate('Transactions')}
      />
      */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  userContainer: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
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
    marginBottom: 8,
  },
  titleUser: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12
  },
  subtitleUser: {
    fontSize: 16,
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
  qrContainer: {
    width: '100%',
    justifyContent: 'space-around',
    height: '20%',
    
    marginVertical: 15,
    
  },
  // buttonLogoutContainer: {
  //   marginTop: 25
  // },
});

export default HomeScreen;