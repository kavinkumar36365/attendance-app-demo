import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';

const BiometricAuthentication = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  
  useEffect(() => {
    // Check if biometric authentication is supported
    (async () => {
      try {
        const supported = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(supported);

        if (supported) {
          const enrolled = await LocalAuthentication.isEnrolledAsync();
          if (enrolled) {
            const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
            if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
              setBiometricType('fingerprint');
            } else if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
              setBiometricType('face');
            }
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Biometric support check failed');
        console.error(error);
      }
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
        if (biometricType === 'none') {
            Alert.alert('No Biometrics', 'This device has no biometric types available.');
            return;
            }

        let authResult;
 
        if (biometricType === 'fingerprint') {
            authResult = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with Fingerprint',
            disableDeviceFallback: true,
            cancelLabel: 'Cancel',
            });
        } else if (biometricType === 'face') {
            authResult = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with Face ID',
            disableDeviceFallback: true,
            cancelLabel: 'Cancel',
            });
        }
        if (authResult?.success) {
            setIsAuthenticated(true);
            Alert.alert('Authenticated', 'Welcome back!');
            router.push('home');
        } else {
            Alert.alert('Authentication failed', 'Please try again.');
        }
        } catch (error) {
        console.error('Authentication error:', error);
        Alert.alert('Error', 'Authentication failed, please try again.');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>
            {isAuthenticated ? 'Authenticated!' : 'Please authenticate with biometrics'}
        </Text>
        {isBiometricSupported ? (
            <Button title="Authenticate" onPress={handleBiometricAuth} />
        ) : (
            <Text>Your device does not support biometrics</Text>
        )}
        </View>
    );
};

export default BiometricAuthentication;
