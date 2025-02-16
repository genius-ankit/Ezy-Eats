import { StyleSheet, View, Text } from 'react-native';
import QRScanner from '@/components/QRScanner';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Alert } from 'react-native';
import { useVendor } from '@/context/VendorContext';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isVeg?: boolean;
  available: boolean;
}

interface QRData {
  type: string;
  canteenId: string;
  menuId: string;
  canteenName: string;
  items: MenuItem[];
}

export default function ScanScreen() {
  const { getMenuItems, loadMenuItems } = useVendor();

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    try {
      console.log('Raw QR code data:', data);
      const parsedData = JSON.parse(data) as QRData;
      console.log('Parsed QR data:', parsedData);

      if (!parsedData.type || !parsedData.canteenId) {
        console.log('Invalid QR data structure:', parsedData);
        Alert.alert('Error', 'Invalid QR code format. Missing required data.');
        return;
      }

      // Fetch menu items when QR is scanned
      await loadMenuItems();
      const menuItems = await getMenuItems(parsedData.canteenId);
      
      if (!menuItems || menuItems.length === 0) {
        Alert.alert('No Menu Items', 'This canteen has not added any menu items yet.');
        return;
      }

      router.push({
        pathname: '/menu/[canteenId]/[menuId]',
        params: {
          canteenId: parsedData.canteenId,
          menuId: parsedData.menuId,
          menuData: JSON.stringify(menuItems)
        }
      });
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Error', 'Invalid QR code format. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Instructions Section */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.title}>Scan Canteen QR Code</Text>
        <Text style={styles.subtitle}>Get your menu in seconds!</Text>
      </View>

      {/* Scanner Section */}
      <View style={styles.scannerContainer}>
        <View style={styles.scannerBox}>
          <QRScanner />
        </View>
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />
      </View>

      {/* Help Section */}
      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>How to scan:</Text>
        <Text style={styles.helpText}>1. Find the QR code at your canteen</Text>
        <Text style={styles.helpText}>2. Center it in the square frame</Text>
        <Text style={styles.helpText}>3. Hold steady until menu appears</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  instructionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scannerContainer: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  scannerBox: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 40,
    height: 40,
    borderColor: '#007AFF',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 40,
    height: 40,
    borderColor: '#007AFF',
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 40,
    height: 40,
    borderColor: '#007AFF',
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 40,
    height: 40,
    borderColor: '#007AFF',
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  helpContainer: {
    padding: 20,
    marginTop: 20,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 12,
  },
}); 