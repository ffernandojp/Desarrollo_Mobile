// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import QRGeneratorScreen from './screens/QRGeneratorScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaymentScreen from './screens/PaymentScreen';
import QRCodeDisplayScreen from './screens/QRCodeDisplayScreen';
import { BalanceProvider } from './context/BalanceContext';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <BalanceProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="GenerateQR" component={QRGeneratorScreen} />
        <Stack.Screen name="QRCodeDisplay" component={QRCodeDisplayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </BalanceProvider>
  );
}

