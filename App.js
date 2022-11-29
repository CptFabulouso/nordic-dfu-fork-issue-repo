import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SERVICE_UUIDS = [];
const App = () => {
  const [bleManagerStarted, setBleManagerStarted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const peripherals = useRef(new Map());

  useEffect(() => {
    BleManager.start().then(() => {
      setBleManagerStarted(true);
    });

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission',
        message: 'Agree',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ],
      {
        title: 'Bluetooth scan permission',
        message: 'Agree',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    const sub1 = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        console.log({peripheral});
        if (!peripheral.name) {
          peripheral.name = 'NO NAME';
        }
        peripherals.current.set(peripheral.id, peripheral);
        setDevices(Array.from(peripherals.current.values()));
      },
    );
    const sub2 = bleManagerEmitter.addListener('BleManagerStopScan', () => {
      setScanning(false);
    });

    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  const startSearch = useCallback(() => {
    BleManager.scan(SERVICE_UUIDS, 30, true).then(() => {
      setScanning(true);
    });
  }, []);

  const stopSearch = useCallback(() => {
    BleManager.stopScan();
  }, []);

  if (!bleManagerStarted) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={{fontSize: 20, marginBottom: 10}}>BLE Manager Started</Text>
      <Button
        title={scanning ? 'stop search' : 'start search'}
        onPress={scanning ? stopSearch : startSearch}
      />
      <Text style={{fontSize: 20, marginTop: 20}}>Found devices:</Text>
      {!devices.length && <Text>No devices found</Text>}
      {devices.map(device => (
        <Text key={device.id} style={{marginBottom: 10}}>
          {device.name}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
