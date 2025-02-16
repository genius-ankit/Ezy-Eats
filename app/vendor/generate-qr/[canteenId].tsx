import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Share, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useVendor } from '@/context/VendorContext';

type QRCodeRef = {
  toDataURL: (callback: (dataURL: string) => void) => void;
};

export default function GenerateQRScreen() {
  const { canteenId } = useLocalSearchParams<{ canteenId: string }>();
  const { hasMenuItems, canteenName, menuItems } = useVendor();
  const qrRef = useRef<QRCodeRef | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [qrData, setQrData] = useState('Loading...');

  useEffect(() => {
    const loadQRData = async () => {
      try {
        // Only check if menu items exist
        const hasItems = hasMenuItems(canteenId);
        
        if (!hasItems) {
          setQrData('No menu items available');
          return;
        }

        // Update the QR code data structure
        const qrData = {
          type: 'menu',
          canteenId,
          menuId: canteenId,
          canteenName: canteenName
        };
        
        const qrString = JSON.stringify(qrData);
        console.log('Generated QR data:', qrString);
        setQrData(qrString);
      } catch (error) {
        console.error('Error generating QR:', error);
        setQrData('Error loading menu data');
      }
    };
    loadQRData();
  }, [canteenId]);

  const saveToPhotos = async () => {
    try {
      setSaving(true);
      
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to save the QR code.');
        return;
      }

      // Get QR code as base64
      const getDataURL = () => new Promise<string>((resolve) => {
        qrRef.current?.toDataURL((data) => resolve(data));
      });

      const dataURL = await getDataURL();
      const fileUri = `${FileSystem.documentDirectory}qr-code-${canteenId}.png`;

      // Save QR code to file
      await FileSystem.writeAsStringAsync(fileUri, dataURL, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save to photos
      await MediaLibrary.saveToLibraryAsync(fileUri);
      alert('QR Code saved to photos!');
    } catch (error) {
      console.error('Error saving to photos:', error);
      alert('Failed to save QR code to photos');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!qrRef.current) {
      alert('QR Code not ready. Please try again.');
      return;
    }

    try {
      setDownloading(true);

      // Create a Promise wrapper for toDataURL callback
      const getDataURL = () => new Promise<string>((resolve) => {
        qrRef.current?.toDataURL((data) => resolve(data));
      });

      const dataURL = await getDataURL();
      const fileUri = `${FileSystem.documentDirectory}qr-code-${canteenId}.png`;

      // Save QR code to file
      await FileSystem.writeAsStringAsync(fileUri, dataURL, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Check if sharing is available (required for Android)
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: 'Download QR Code',
          UTI: 'public.png'
        });
      } else {
        // Fallback for platforms where sharing might not be available
        await Share.share({
          url: fileUri,
          message: 'Your EzyEats QR Code'
        });
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Canteen QR Code</Text>
      
      <View style={styles.qrContainer}>
        {qrData !== 'Loading...' && qrData !== 'No menu items available' && qrData !== 'Error loading menu data' ? (
          <QRCode
            value={qrData}
            size={200}
            color="#2E8B57"
            backgroundColor="white"
            getRef={(ref) => (qrRef.current = ref)}
          />
        ) : (
          <Text style={styles.loadingText}>{qrData}</Text>
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>✨ Dynamic Menu QR</Text>
        <Text style={styles.infoText}>
          This QR code will always show your latest menu. You don't need to generate 
          a new QR code when you update your menu items.
        </Text>
      </View>

      <Text style={styles.refreshNote}>
        QR Code automatically updates with menu changes
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={saveToPhotos}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Saving...' : 'Save to Photos'}
          </Text>
        </Pressable>

        <Pressable 
          style={[styles.button, downloading && styles.buttonDisabled]}
          onPress={handleDownload}
          disabled={downloading}
        >
          <Text style={styles.buttonText}>
            {downloading ? 'Sharing...' : 'Share QR Code'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.instructions}>
        Display this QR code at your canteen. Customers can scan it to:
      </Text>
      <View style={styles.bulletPoints}>
        <Text style={styles.bullet}>• View your menu</Text>
        <Text style={styles.bullet}>• Place orders</Text>
        <Text style={styles.bullet}>• Make payments</Text>
      </View>

      <Text style={styles.note}>
        Note: Update your menu items to refresh the QR code automatically.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 30,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#2E8B57',
    fontWeight: '500',
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  bulletPoints: {
    marginLeft: 20,
    marginBottom: 20,
  },
  bullet: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  note: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#1a5235',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
}); 