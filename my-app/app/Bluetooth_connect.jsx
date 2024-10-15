import React, { useEffect } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';

const manager = new BleManager();

export default function App() {

  useEffect(() => {
    scanForBeacons();
  }, []);

  const scanForBeacons = async () => {
    if (Platform.OS === 'android') {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
        return;
      }
    }

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error scanning for devices:', error);
        return;
      }

      if (device) {
        console.log('Device name:', device.name);
        console.log('Device UUID:', device.id);
        console.log('RSSI:', device.rssi);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
    }, 5000);  // Stops scanning after 5 seconds
  };

  return (
    <View>
      <Text>Scanning for BLE Beacons...</Text>
    </View>
  );
}
