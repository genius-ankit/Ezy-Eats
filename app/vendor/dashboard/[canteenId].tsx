import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useVendor } from '@/context/VendorContext';

export default function VendorDashboard() {
  const { canteenId } = useLocalSearchParams<{ canteenId: string }>();
  const { hasMenuItems } = useVendor();
  
  // Use the actual menu items check
  const hasItems = hasMenuItems(canteenId);

  const MENU_OPTIONS = [
    { 
      id: 'menu',
      title: 'Manage Menu',
      icon: 'restaurant-menu',
      description: 'Add or edit menu items',
      route: `/vendor/menu/${canteenId}`
    },
    { 
      id: 'qr',
      title: 'Generate QR Codes',
      icon: 'qr-code',
      description: 'Create QR codes for your menu',
      route: `/vendor/generate-qr/${canteenId}`,
      disabled: !hasItems // Use the actual check
    },
    { 
      id: 'orders',
      title: 'View Orders',
      icon: 'receipt-long',
      description: 'Manage customer orders',
      route: '/vendor/orders'
    }
  ];

  const handleOptionPress = (option: typeof MENU_OPTIONS[0]) => {
    if (option.id === 'qr' && !hasItems) {
      alert('Please add menu items first before generating QR codes');
      return;
    }
    router.push(option.route as any);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Vendor Portal",
          headerBackVisible: false 
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Manage Your Shop</Text>
        
        <View style={styles.grid}>
          {MENU_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.card,
                option.id === 'qr' && !hasItems && styles.cardDisabled
              ]}
              onPress={() => handleOptionPress(option)}
            >
              <MaterialIcons 
                name={option.icon as any} 
                size={32} 
                color={option.id === 'qr' && !hasItems ? '#ccc' : '#2E8B57'} 
              />
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
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
    marginBottom: 24,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardDescription: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  }
}); 