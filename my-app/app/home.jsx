import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Bluetooth_connect from '../components/Bluetooth_connect';

const HomeScreen = () => {
  return (
    <>
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
    </View>
    <Bluetooth_connect/>
    </>
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
  },
});

export default HomeScreen;
