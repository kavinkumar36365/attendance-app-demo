import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';

const IndexScreen = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = async () => {
    try {
      // Check if device supports biometric authentication
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Biometric Auth not supported');
        return;
      }

      // Check if biometric records exist (fingerprint or face)
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('No biometrics enrolled');
        return;
      }

      // Authenticate the user
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with your fingerprint',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        setIsAuthenticated(true);
        Alert.alert('Authentication successful');
        // Navigate to next screen or main app
        router.push('/home');
      } else {
        Alert.alert('Authentication failed');
      }
    } catch (error) {
      Alert.alert('An error occurred during authentication');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Attendance App</Text>
      <Button title="Retry Authentication" onPress={authenticate} />
      {isAuthenticated && <Text style={styles.success}>Authenticated!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  success: {
    fontSize: 18,
    color: 'green',
    marginTop: 10,
  },
});

export default IndexScreen;
