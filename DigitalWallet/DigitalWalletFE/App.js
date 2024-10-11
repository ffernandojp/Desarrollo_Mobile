// import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import QRGeneratorScreen from './screens/QRGeneratorScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaymentScreen from './screens/PaymentScreen';
import QRCodeDisplayScreen from './screens/QRCodeDisplayScreen';
import { BalanceProvider } from './context/BalanceContext';
import LoginScreen from './screens/LoginScreen';
import { SessionProvider } from './context/SessionContext';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <SessionProvider>

      <BalanceProvider>
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="GenerateQR" component={QRGeneratorScreen} />
          <Stack.Screen name="QRCodeDisplay" component={QRCodeDisplayScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      </BalanceProvider>
    </SessionProvider>
  );
}

