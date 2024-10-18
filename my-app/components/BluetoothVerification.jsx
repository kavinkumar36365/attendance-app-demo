import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const requestBluetoothPermission = async () => {
  console.log('Requesting Bluetooth permission');
  if (Platform.OS === 'ios') {
    return true; // iOS permissions are handled differently
  }

  if (Platform.OS === 'android') {
    const apiLevel = parseInt(Platform.Version.toString(), 10);

    // For Android below 12 (API < 31)
    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    // For Android 12+ (API 31+)
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ]);

    return (
      result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
      result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
      result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
    );
  }

  return false; // Permissions not granted
};

const scanForBeacons = (setUuid, setRssi, setAdvertisedServiceUUIDs) => {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.log('Error scanning for devices:', error);
      return;
    }

    if (device) {
      console.log('Found device:', device.id, device.name);
      setUuid(device.id);  // Use device.id as the unique identifier
      setRssi(device.rssi);

      // Get the advertised service UUIDs
      if (device.serviceUUIDs) {
        console.log('Advertised Service UUIDs:', device.serviceUUIDs);
        setAdvertisedServiceUUIDs(device.serviceUUIDs); // Set advertised UUIDs in state
      } else {
        console.log('No advertised service UUIDs found');
      }
    }
  });
};

const BluetoothVerification = () => {
  const [uuid, setUuid] = useState('');
  const [rssi, setRssi] = useState(0);
  const [advertisedServiceUUIDs, setAdvertisedServiceUUIDs] = useState([]);

  useEffect(() => {
    console.log('BluetoothVerification mounted');
    const checkPermissionsAndScan = async () => {
      const hasPermission = await requestBluetoothPermission();
      if (!hasPermission) {
        console.log('Location permission denied');
        return;
      }

      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          scanForBeacons(setUuid, setRssi, setAdvertisedServiceUUIDs);
          subscription.remove(); // Remove subscription once scan starts
        }
      }, true);

      return () => {
        subscription.remove(); // Cleanup when component unmounts
        manager.stopDeviceScan(); // Stop scanning to avoid memory leaks
      };
    };

    checkPermissionsAndScan();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Bluetooth Verification</Text>
      <Text>Device ID: {uuid}</Text>
      <Text>RSSI: {rssi}</Text>
      <Text>Advertised Service UUIDs:</Text>
      {advertisedServiceUUIDs.length > 0 ? (
        advertisedServiceUUIDs.map((uuid, index) => <Text key={index}>{uuid}</Text>)
      ) : (
        <Text>No advertised service UUIDs</Text>
      )}
    </View>
  );
};

export default BluetoothVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
