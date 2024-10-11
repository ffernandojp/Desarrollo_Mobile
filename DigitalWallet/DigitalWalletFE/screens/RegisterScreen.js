import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';


const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setUser } = useSession();

    const handleLogin = () => {
        navigation.navigate('Login');
    }; 


    const handleRegister = async () => {
      fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/register`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
      }).then(response => response.json()).then(data => {
          if (data.success) {
              Alert.alert('Register Successful', 'Welcome! You can now login.');
              navigation.navigate('Login');
          }
          else {
              Alert.alert('Register Failed', data.error);
          }
      }).catch(error => {
          Alert.alert('Error', error.message || 'An unexpected error occurred.');
      })
  };

    return (
        <View style={styles.container}>
          <Image source={require('../assets/e-wallet.png')} style={styles.logo} />
            <Text style={styles.mainTitle}>Register to Digital Wallet</Text>
            <View style={styles.form}>
            <Text style={styles.title}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
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
            <Button title="Register" onPress={handleRegister} />
            <View style={styles.buttons}>
                <Text style={styles.titleLogIn}>Already have an account?</Text>
                <Button color={'grey'} title="Login" onPress={handleLogin} />
                {/* <Button color={'grey'} title="Forgot Password" onPress={handleForgotPassword} /> */}
            </View>
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
    titleLogIn: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 24,
      textAlign: 'center',
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
      justifyContent: 'center',
      marginTop: 32,
      marginBottom: 46,
  },
});

export default RegisterScreen;