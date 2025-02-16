import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { router } from 'expo-router';
import { useVendor } from '@/context/VendorContext';
import { imageHelper } from '@/utils/imageHelper';

export default function QRScanner() {
  const { getMenuItems, loadMenuItems } = useVendor();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      console.log('Raw scanned data:', data);
      const scannedData = JSON.parse(data);
      console.log('Parsed QR data:', scannedData);

      if (scannedData.type === 'menu' && scannedData.canteenId) {
        await loadMenuItems(); // Reload menu items
        const menuItems = await getMenuItems(scannedData.canteenId);
        
        if (!menuItems || menuItems.length === 0) {
          alert('No menu items found for this canteen');
          return;
        }

        // Load images for menu items
        const itemsWithImages = await Promise.all(
          menuItems.map(async (item) => {
            if (item.imageUrl) {
              const imageUri = await imageHelper.getImageUri(scannedData.canteenId, item.id);
              return { ...item, imageUrl: imageUri };
            }
            return item;
          })
        );

        router.push({
          pathname: '/menu/[canteenId]/[menuId]',
          params: {
            canteenId: scannedData.canteenId,
            menuId: scannedData.menuId,
            menuData: JSON.stringify(itemsWithImages)
          }
        });
      } else {
        throw new Error('Invalid QR format');
      }
    } catch (error) {
      console.error('Error parsing QR code:', error);
      alert('Invalid QR code format');
    } finally {
      setTimeout(() => {
        setScanned(false);
      }, 2000);
    }
  };

  if (hasPermission === null || hasPermission === false) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 