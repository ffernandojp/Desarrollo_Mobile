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
import RegisterScreen from './screens/RegisterScreen';
import DepositScreen from './screens/DepositScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import { TransactionsProvider } from './context/TransactionsContext';
import WithdrawScreen from './screens/WithdrawScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <SessionProvider>
      <TransactionsProvider>
        <BalanceProvider>
          <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="GenerateQR" component={QRGeneratorScreen} />
            <Stack.Screen name="QRCodeDisplay" component={QRCodeDisplayScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Deposit" component={DepositScreen} />
            <Stack.Screen name="Withdraw" component={WithdrawScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        </BalanceProvider>
      </TransactionsProvider>
    </SessionProvider>
  );
}

