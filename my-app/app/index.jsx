import React from 'react';
import { View, StyleSheet } from 'react-native';
import BiometricAuthentication from '../components/BiometricAuthentication';

const Home = () => {
  return (
    <View style={styles.container}>
      <BiometricAuthentication />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Home;
