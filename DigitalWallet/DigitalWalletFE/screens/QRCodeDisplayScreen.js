import React from 'react';
import { View, Image, StyleSheet, Button, Alert, Text } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const QRCodeDisplayScreen = ({ route }) => {
    const { qrCodeUrl } = route.params; // Get the QR code URL from navigation params

    const navigation = useNavigation();

    const copyToClipboard = async () => {
      await Clipboard.setStringAsync(qrCodeUrl); // Copying the text to clipboard
      Alert.alert(`Link copied to Clipboard! \n \nShare it with your friends!`);
  };

    return (
        <View style={styles.container}>
                <Text style={styles.mainText}>QR Code</Text>
            <Image source={{ uri: qrCodeUrl }} style={styles.qrCodeImage} />
            <View style={styles.ButtonsContainer}>
            <Button
                    color={'grey'}
                    title="Return to Home"
                    onPress={() => navigation.navigate('Home')}
                />
                <Button
                    title="Copy QR Code"
                    onPress={copyToClipboard}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrCodeImage: {
        width: 200,
        height: 200,
    },
    ButtonsContainer: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 25
    },
    mainText: {
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 30
    },
});

export default QRCodeDisplayScreen;