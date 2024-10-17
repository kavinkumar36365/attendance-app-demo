import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Platform, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const requestBluetoothPermission = async () => {
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

const scanForBeacons = () => {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.log('Error scanning for devices:', error);
      return;
    }

    if (device) {
      device.serviceUUIDs?.forEach((serviceUUID) => {
        console.log('Found device:', device.id, device.name, serviceUUID);
      });
      console.log('RSSI:', device.rssi);
    }
  });
};

const BluetoothVerification = () => {
  useEffect(() => {
    const checkPermissionsAndScan = async () => {
      const hasPermission = await requestBluetoothPermission();
      if (!hasPermission) {
        console.log('Location permission denied');
        return;
      }

      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          scanForBeacons();
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bluetooth Verification</Text>
    </View>
  );
};

export default BluetoothVerification;

const styles = StyleSheet.create({});
