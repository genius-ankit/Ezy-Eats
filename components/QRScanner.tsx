import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { router } from 'expo-router';

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: number; data: string }) => {
    setScanned(true);
    try {
      let canteenId, menuId;

      // Check if it's a URL or direct text
      if (data.startsWith('http')) {
        // Extract the last part of the URL
        const url = new URL(data);
        const path = url.pathname.split('/').filter(Boolean);
        const lastSegment = path[path.length - 1];
        
        // Check if the last segment contains the format we want
        if (lastSegment && lastSegment.includes(':')) {
          [canteenId, menuId] = lastSegment.split(':');
        } else {
          throw new Error('Invalid URL format');
        }
      } else if (data.includes(':')) {
        // Direct text format (canteenId:menuId)
        [canteenId, menuId] = data.split(':');
      } else {
        throw new Error('Invalid format');
      }

      if (canteenId && menuId) {
        router.push(`/menu/${canteenId}/${menuId}`);
      } else {
        throw new Error('Missing canteenId or menuId');
      }
    } catch (error) {
      console.error('Error parsing QR code:', error);
      alert('Invalid QR code format. Please use format: canteenId:menuId');
    }
    
    // Reset scanner after 2 seconds
    setTimeout(() => {
      setScanned(false);
    }, 2000);
  };

  if (hasPermission === null || hasPermission === false) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 