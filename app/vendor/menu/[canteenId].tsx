import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useVendor } from '@/context/VendorContext';
import type { MenuItem } from '@/context/VendorContext';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { imageHelper } from '@/utils/imageHelper';

export default function MenuManagement() {
  const { canteenId } = useLocalSearchParams<{ canteenId: string }>();
  const { getMenuItems, addMenuItem, removeMenuItem, updateMenuItem, loadMenuItems } = useVendor();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVeg, setIsVeg] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadItems = async () => {
    try {
      setRefreshing(true);
      console.log('Before loadMenuItems - canteenId:', canteenId);
      await loadMenuItems(); // First refresh the context
      console.log('After loadMenuItems');
      const items = await getMenuItems(canteenId);
      console.log('Retrieved items:', items);
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading items:', error);
      Alert.alert('Error', 'Failed to load menu items');
    } finally {
      setRefreshing(false);
    }
  };

  // Use loadItems in useEffect
  useEffect(() => {
    loadItems();
  }, [canteenId]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to add images!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        // Compress and resize the image
        const manipulatedImage = await manipulateAsync(
          result.assets[0].uri,
          [
            { resize: { width: 300, height: 300 } }
          ],
          {
            compress: 0.7,
            format: SaveFormat.JPEG,
            base64: true
          }
        );

        if (manipulatedImage.base64) {
          const compressedBase64 = `data:image/jpeg;base64,${manipulatedImage.base64}`;
          setImageUrl(compressedBase64);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to process image');
    }
  };

  const handleAddItem = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter a food item name');
        return;
      }
      if (!price.trim() || isNaN(parseFloat(price))) {
        Alert.alert('Error', 'Please enter a valid price');
        return;
      }

      setIsLoading(true);
      const itemToAdd: Omit<MenuItem, 'id'> = {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        isVeg,
        available: true
      };

      // Add the item
      await addMenuItem(canteenId, itemToAdd);

      // Reset form
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setIsVeg(true);

      // Refresh the list
      await loadItems();

      Alert.alert('Success', 'Menu item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add menu item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this useEffect to keep menu items in sync
  useEffect(() => {
    const syncMenuItems = async () => {
      const items = await getMenuItems(canteenId);
      setMenuItems(items);
    };
    
    syncMenuItems();
  }, [canteenId]);

  const handleRemoveItem = async (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMenuItem(canteenId, itemId);
              // Update local state immediately after removal
              const updatedItems = await getMenuItems(canteenId);
              setMenuItems(updatedItems);
              Alert.alert('Success', 'Item removed successfully');
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove menu item');
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Menu Management",
          headerBackTitle: "Back"
        }} 
      />

      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadItems}
          />
        }
      >
        <View style={styles.addItemSection}>
          <Text style={styles.sectionTitle}>Add New Item</Text>
          
          <Pressable 
            style={[styles.imagePickerButton, imageUrl ? styles.imagePickerWithImage : null]} 
            onPress={pickImage}
          >
            {imageUrl ? (
              <>
              <Image source={{ uri: imageUrl }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <MaterialIcons name="edit" size={24} color="white" />
                </View>
              </>
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="add-photo-alternate" size={32} color="#666" />
                <Text style={styles.imagePlaceholderText}>Add Image</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.formFields}>
          <TextInput
              style={[styles.input, !name.trim() && styles.inputWarning]}
              placeholder="Item Name *"
            value={name}
            onChangeText={setName}
              placeholderTextColor="#666"
          />
          <TextInput
              style={[styles.input, (!price.trim() || isNaN(parseFloat(price))) && styles.inputWarning]}
              placeholder="Price *"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
              placeholderTextColor="#666"
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
              placeholderTextColor="#666"
            />
          </View>

          <Pressable 
            style={[styles.addButton, isLoading && styles.addButtonDisabled]}
            onPress={handleAddItem}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Add Item</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Current Menu Items</Text>
          {menuItems.length === 0 ? (
            <Text style={styles.emptyText}>No items in menu</Text>
          ) : (
            menuItems.map(item => (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.itemImageContainer}>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  ) : (
                    <View style={[styles.itemImage, styles.noImage]}>
                      <MaterialIcons name="restaurant" size={24} color="#ccc" />
                    </View>
                  )}
                </View>
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <MaterialIcons 
                      name="circle" 
                      size={16} 
                      color={item.isVeg ? '#2E8B57' : '#FF4444'} 
                    />
                  </View>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  {item.description && (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  )}
                </View>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <MaterialIcons name="delete" size={24} color="#FF4444" />
                </Pressable>
              </View>
            ))
          )}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  addItemSection: {
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  menuSection: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  imagePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginLeft: 8,
    color: '#666',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  vegToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vegLabel: {
    marginRight: 8,
    color: '#333',
  },
  vegButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  selectedVegButton: {
    backgroundColor: '#2E8B57',
  },
  selectedNonVegButton: {
    backgroundColor: '#FF4444',
  },
  vegButtonText: {
    color: '#333',
  },
  selectedVegButtonText: {
    color: 'white',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7
  },
  inputError: {
    borderColor: '#ff4444'
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4
  },
  formFields: {
    gap: 12,
    marginTop: 16,
  },
  inputWarning: {
    borderColor: '#ffcdd2',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  noImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  deleteButton: {
    padding: 8,
  },
  imagePickerWithImage: {
    padding: 0,
    width: 100,
    height: 100,
  },
}); 