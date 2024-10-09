// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import QRGeneratorScreen from './screens/QRGeneratorScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaymentScreen from './screens/PaymentScreen';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="GenerateQR" component={QRGeneratorScreen} />
    </Stack.Navigator>
  </NavigationContainer>
    // <View style={styles.container}>
    //   {/* <Text>Open up App.js to start working on your app!</Text> */}
    //   <HomeScreen />
    //   {/* <QRScannerScreen /> */}
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
