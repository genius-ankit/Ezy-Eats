import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Share, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// Sample canteen data - you can modify this
const CANTEENS = [
  {
    id: 'canteen1',
    name: 'Main Cafeteria',
    menus: [
      { id: 'menu123', name: 'Vegetarian Special Menu' },
      { id: 'menu124', name: 'Daily Special Menu' },
    ],
  },
  {
    id: 'canteen2',
    name: 'Coffee Shop',
    menus: [
      { id: 'menu223', name: 'Beverages Menu' },
      { id: 'menu224', name: 'Snacks Menu' },
    ],
  },
];

export default function GenerateQRScreen() {
  const [selectedCanteen, setSelectedCanteen] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('');
  const qrRef = useRef();

  const generateQRValue = () => {
    // Format that matches our scanner's expected format
    return `${selectedCanteen}:${selectedMenu}`;
  };

  const handleShare = async () => {
    if (!selectedCanteen || !selectedMenu) {
      alert('Please select both canteen and menu');
      return;
    }

    const canteen = CANTEENS.find(c => c.id === selectedCanteen);
    const menu = canteen?.menus.find(m => m.id === selectedMenu);

    if (!canteen || !menu) return;

    try {
      await Share.share({
        message: `Scan QR code for ${canteen.name} - ${menu.name}\nCode: ${generateQRValue()}`
      });
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Error sharing QR code');
    }
  };

  const handleDownload = async () => {
    try {
      // Request permissions (Android only)
      if (Platform.OS === 'android') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need media permissions to save the QR code');
          return;
        }
      }

      // Get QR code as base64
      let qrImage;
      // @ts-ignore - getDataURL exists but isn't in types
      await qrRef.current.toDataURL(async (data: string) => {
        qrImage = `data:image/png;base64,${data}`;
        
        // Save to file
        const filename = FileSystem.documentDirectory + `qr-${selectedCanteen}-${selectedMenu}.png`;
        await FileSystem.writeAsStringAsync(filename, qrImage.split(',')[1], {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(filename);
        await MediaLibrary.createAlbumAsync('EzyEats QR Codes', asset, false);

        alert('QR Code saved to your photos!');
      });
    } catch (error) {
      console.error('Error saving QR:', error);
      alert('Failed to save QR code');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Generate QR Codes</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Canteen:</Text>
        <View style={styles.optionsContainer}>
          {CANTEENS.map((canteen) => (
            <Pressable
              key={canteen.id}
              style={[
                styles.option,
                selectedCanteen === canteen.id && styles.selectedOption
              ]}
              onPress={() => {
                setSelectedCanteen(canteen.id);
                setSelectedMenu('');
              }}
            >
              <Text style={[
                styles.optionText,
                selectedCanteen === canteen.id && styles.selectedOptionText
              ]}>
                {canteen.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {selectedCanteen && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Menu:</Text>
          <View style={styles.optionsContainer}>
            {CANTEENS.find(c => c.id === selectedCanteen)?.menus.map((menu) => (
              <Pressable
                key={menu.id}
                style={[
                  styles.option,
                  selectedMenu === menu.id && styles.selectedOption
                ]}
                onPress={() => setSelectedMenu(menu.id)}
              >
                <Text style={[
                  styles.optionText,
                  selectedMenu === menu.id && styles.selectedOptionText
                ]}>
                  {menu.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {selectedCanteen && selectedMenu && (
        <View style={styles.qrContainer}>
          <QRCode
            value={generateQRValue()}
            size={200}
            // @ts-ignore - ref exists but isn't in types
            getRef={(ref) => (qrRef.current = ref)}
          />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={handleShare}>
              <Text style={styles.buttonText}>Share QR Code</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleDownload}>
              <Text style={styles.buttonText}>Save to Photos</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E8B57',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#2E8B57',
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 