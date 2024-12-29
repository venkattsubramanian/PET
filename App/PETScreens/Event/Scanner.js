import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';

const Scanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white', left: 25, padding: 10}}>No access to camera. Please enable it in your settings.</Text>
        <Button title="Open Settings" onPress={openSettings} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay}>
        {/* Test with a static image */}
        <Image
          source={require('../../../assets/images/scannerblue.gif')} // Use a static image to test
          style={styles.scanningImage}
          resizeMode="contain"
        />
      </View>

      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
      {scannedData && (
        <View style={styles.dataContainer}>
          <Text>Scanned Data: {scannedData}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 40, 
    left: 20,
    zIndex: 2, 
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, 
  },
  scanningImage: {
    width: '80%',
    height: '50%',
  },
  dataContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Scanner;
