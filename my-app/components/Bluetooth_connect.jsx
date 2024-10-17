/* import React, { useEffect,useState } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';

const manager = new BleManager();

const Bluetooth_connect = () => {
  const [UUID, setUUID] = useState('no UUID');
  const [RSSI, setRSSI] = useState('no RSSI');

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
        console.log('Found device:', device.id, device.name);
        setUUID(device.id);
        setRSSI(device.rssi);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
    }, 5000);  // Stops scanning after 5 seconds
  };

  return (
    <View>
      <Text>Scanning for BLE Beacons...</Text>
      <Text>UUID: {UUID}</Text>
      <Text>RSSI: {RSSI}</Text>
    </View>
  );
}

export default Bluetooth_connect; */