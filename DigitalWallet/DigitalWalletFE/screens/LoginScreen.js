import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';


const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setUser } = useSession();

    // const handleRegister = () => {
    //     navigation.navigate('Register');
    // }; 

    // const handleForgotPassword = () => {
    //     navigation.navigate('ForgotPassword');
    // };

    const handleLogin = async () => {
      fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/auth`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      }).then(response => response.json()).then(data => {
          if (data.token) {
              SecureStore.setItemAsync('jwtToken', data.token);
              setUser(data.user);
              Alert.alert('Login Successful', 'Welcome back!');
              navigation.navigate('Home');
          }
          else {
              Alert.alert('Login Failed', data.error);
          }
      }).catch(error => {
          Alert.alert('Error', error.message || 'An unexpected error occurred.');
      })
  };

    return (
        <View style={styles.container}>
          <Image source={require('../assets/e-wallet.png')} style={styles.logo} />
            <Text style={styles.mainTitle}>Login to your account</Text>
            <View style={styles.form}>

          <Text style={styles.title}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.title}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            </View>
            <Button title="Login" onPress={handleLogin} />
            {/* <View style={styles.buttons}>
                <Button color={'grey'} title="Register" onPress={handleRegister} />
                <Button color={'grey'} title="Forgot Password" onPress={handleForgotPassword} />
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 12,
        alignSelf: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 34,
        textAlign: 'center',
    },
    form: {
        marginBottom: 16,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 32,
        marginBottom: 46,
    },
});

export default LoginScreen;