import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';

// Add these types at the top
type MenuItem = {
  id: number;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  isVeg: boolean;
};

type Menu = {
  name: string;
  items: MenuItem[];
};

type CanteenData = {
  name: string;
  [menuId: string]: Menu | string;  // Allow both Menu objects and string (for name)
};

type MenuData = {
  [canteenId: string]: CanteenData;
};

// Update MOCK_MENU with the type
const MOCK_MENU: MenuData = {
  canteen1: {
    name: "Main Cafeteria",
    menu123: {
      name: "Vegetarian Special Menu",
      items: [
        { 
          id: 1, 
          name: "Margherita Pizza", 
          price: "$8.99", 
          description: "Fresh tomatoes, mozzarella, basil",
          imageUrl: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500",
          isVeg: true
        },
        { 
          id: 2, 
          name: "Garden Salad", 
          price: "$4.99", 
          description: "Mixed greens, cherry tomatoes, cucumber",
          imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
          isVeg: true
        },
        { 
          id: 3, 
          name: "Veggie Pasta", 
          price: "$7.99", 
          description: "Penne with mixed vegetables in tomato sauce",
          imageUrl: "https://images.unsplash.com/photo-1516685018646-549198525c1b?w=500",
          isVeg: true
        },
        { 
          id: 4, 
          name: "Mushroom Risotto", 
          price: "$9.99", 
          description: "Creamy Italian rice with mushrooms",
          imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500",
          isVeg: true
        },
        { 
          id: 5, 
          name: "Paneer Tikka", 
          price: "$10.99", 
          description: "Grilled cottage cheese with Indian spices",
          imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500",
          isVeg: true
        }
      ]
    }
  }
};

export default function MenuScreen() {
  const { canteenId, menuId } = useLocalSearchParams<{
    canteenId: string;
    menuId: string;
  }>();
  const { addItem, updateQuantity, items } = useCart();
  const canteen = MOCK_MENU[canteenId as keyof typeof MOCK_MENU];
  const menu = typeof canteen?.[menuId] === 'object' ? canteen?.[menuId] as Menu : undefined;

  const getItemQuantity = (itemId: number) => {
    const cartItem = items.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  if (!menu) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Menu not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.canteenName}>{canteen.name}</Text>
        <Text style={styles.title}>{menu.name}</Text>
        
        {menu.items.map((item) => {
          const quantity = getItemQuantity(item.id);
          
          return (
            <Pressable 
              key={item.id} 
              style={styles.menuItem}
            >
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.itemImage}
              />
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <View style={[styles.nameContainer, { flex: 1 }]}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.vegBadge}>
                      <MaterialIcons name="eco" size={16} color="green" />
                    </View>
                  </View>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
                <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
                
                <View style={styles.quantityContainer}>
                  {quantity > 0 ? (
                    <View style={styles.quantityControls}>
                      <Pressable
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, quantity - 1)}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </Pressable>
                      <Text style={styles.quantity}>{quantity}</Text>
                      <Pressable
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, quantity + 1)}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable 
                      style={styles.addButton}
                      onPress={() => addItem({ ...item, canteenId, menuId })}
                    >
                      <Text style={styles.addButtonText}>Add to Cart</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {items.length > 0 && (
        <View style={styles.cartButtonContainer}>
          <Pressable 
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
          >
            <MaterialIcons name="shopping-cart" size={24} color="white" />
            <Text style={styles.cartText}>View Cart ({items.length} items)</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E8B57',
    minWidth: 60,
    textAlign: 'right',
  },
  itemDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  cartButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cartButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vegBadge: {
    backgroundColor: '#E8F5E9',
    padding: 4,
    borderRadius: 4,
  },
  quantityContainer: {
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  quantityButton: {
    backgroundColor: '#007AFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 80,
  },
  canteenName: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
}); 