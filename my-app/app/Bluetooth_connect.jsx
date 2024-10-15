import * as LocalAuthentication from 'expo-local-authentication';

const authenticate = async () => {
  const isBiometricSupported = await LocalAuthentication.hasHardwareAsync();
  if (isBiometricSupported) {
    const auth = await LocalAuthentication.authenticateAsync();
    if (auth.success) {
      console.log('Biometric authentication successful');
    } else {
      console.log('Authentication failed');
    }
  }
};
