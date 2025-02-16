import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useVendor } from '@/context/VendorContext';
import type { CartItem } from '../../../context/CartContext';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isVeg?: boolean;
  available: boolean;
}

const getImageUrl = (url: string) => {
  if (!url) return null;
  // If it's a full base64 image and not too long
  if (url.startsWith('data:image') && url.length < 1000) {
    return { uri: url };
  }
  // Return null for truncated or invalid images
  return null;
};

export default function MenuScreen() {
  const { canteenId, menuId, menuData } = useLocalSearchParams<{
    canteenId: string;
    menuId: string;
    menuData: string;
  }>();
  const { addItem, updateQuantity, items } = useCart();
  const { user } = useAuth();
  const { getMenuItems } = useVendor();

  console.log('Received menuData:', menuData);
  
  let parsedMenuItems: MenuItem[] = [];
  
  try {
    if (menuData) {
      parsedMenuItems = JSON.parse(menuData);
      console.log('Successfully parsed menu items:', parsedMenuItems);
    }
  } catch (error) {
    console.error('Error parsing menu data:', error);
  }

  if (!parsedMenuItems || parsedMenuItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No menu items found</Text>
        <Text style={styles.errorDetail}>
          {menuData ? 'Error parsing menu data' : 'No menu data received'}
        </Text>
        <Text style={styles.errorDetail}>
          Raw menu data: {menuData || 'undefined'}
        </Text>
      </View>
    );
  }

  const getItemQuantity = (itemId: string) => {
    return items.find((item: CartItem) => item.id === itemId)?.quantity || 0;
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="restaurant-menu" size={32} color="#2E8B57" />
          <Text style={styles.canteenName}>Canteen {canteenId}</Text>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {/* Menu Items */}
        {parsedMenuItems.map((item: MenuItem) => {
          const quantity = getItemQuantity(item.id);
          const imageSource = item.imageUrl ? getImageUrl(item.imageUrl) : null;
          
          return (
            <View key={item.id} style={styles.menuItem}>
              <View style={styles.itemContent}>
                {imageSource ? (
                  <Image 
                    source={imageSource} 
                    style={styles.itemImage}
                    onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
                  />
                ) : (
                  <View style={[styles.itemImage, styles.placeholderImage]}>
                    <MaterialIcons name="restaurant" size={32} color="#ccc" />
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.isVeg !== undefined && (
                        <View style={[styles.vegBadge, 
                          { backgroundColor: item.isVeg ? '#E8F5E9' : '#FFEBEE' }
                        ]}>
                          <MaterialIcons 
                            name="circle" 
                            size={12} 
                            color={item.isVeg ? '#2E8B57' : '#FF4444'} 
                          />
                          <Text style={[styles.vegText, 
                            { color: item.isVeg ? '#2E8B57' : '#FF4444' }
                          ]}>
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  {item.description && (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  )}
                  
                  <View style={styles.quantityContainer}>
                    {quantity > 0 ? (
                      <View style={styles.quantityControls}>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.id, quantity - 1)}
                        >
                          <MaterialIcons name="remove" size={20} color="#2E8B57" />
                        </Pressable>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.id, quantity + 1)}
                        >
                          <MaterialIcons name="add" size={20} color="#2E8B57" />
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable 
                        style={styles.addButton}
                        onPress={() => addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          canteenId: canteenId,
                          menuId: menuId,
                          description: item.description,
                          imageUrl: item.imageUrl,
                          isVeg: item.isVeg
                        })}
                      >
                        <Text style={styles.addButtonText}>Add</Text>
                        <MaterialIcons name="add-shopping-cart" size={20} color="white" />
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {items.length > 0 && (
        <View style={styles.cartButtonContainer}>
          <Pressable 
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
          >
            <MaterialIcons name="shopping-cart" size={24} color="white" />
            <Text style={styles.cartText}>
              View Cart ({items.length} items)
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  canteenName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
  },
  menuItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vegBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  vegText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E8B57',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  quantityContainer: {
    marginTop: 'auto',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E8B57',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 12,
  },
  addButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cartButtonContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cartButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
}); 