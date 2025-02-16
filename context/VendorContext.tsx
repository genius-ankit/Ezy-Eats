import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  available: boolean;
  imageUrl?: string;
  isVeg?: boolean;
}

interface VendorContextType {
  menuItems: Record<string, MenuItem[]>;
  addMenuItem: (canteenId: string, item: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
  removeMenuItem: (canteenId: string, itemId: string) => Promise<void>;
  getMenuItems: (canteenId: string) => Promise<MenuItem[]>;
  hasMenuItems: (canteenId: string) => boolean;
  loadMenuItems: () => Promise<void>;
  canteenName: string;
  updateMenuItem: (canteenId: string, itemId: string, updatedItem: MenuItem) => Promise<void>;
}

const VendorContext = createContext<VendorContextType | null>(null);

const STORAGE_KEY = 'vendor_menu_items';

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      const savedItems = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Loading saved items:', savedItems);
      
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        setMenuItems(parsedItems);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMenuItems = async (items: Record<string, MenuItem[]>) => {
    try {
      const itemsString = JSON.stringify(items);
      console.log('Saving items to storage:', itemsString);
      await AsyncStorage.setItem(STORAGE_KEY, itemsString);
      console.log('Items saved successfully');
      setMenuItems(items);
    } catch (error) {
      console.error('Error saving menu items:', error);
      throw error;
    }
  };

  const clearAllMenuItems = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setMenuItems({});
    } catch (error) {
      console.error('Error clearing menu items:', error);
    }
  };

  // Add this to useEffect to clear old data when component mounts
  useEffect(() => {
    const initializeStorage = async () => {
      await clearAllMenuItems();
      loadMenuItems();
    };
    initializeStorage();
  }, []);

  const addMenuItem = async (canteenId: string, item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    try {
      const newItem: MenuItem = {
        ...item,
        id: Date.now().toString(),
        available: true,
        category: item.category || 'Default'
      };
      
      // Get current state
      const currentItems = { ...menuItems };
      
      // Update with new item
      const updatedItems = {
        ...currentItems,
        [canteenId]: [...(currentItems[canteenId] || []), newItem]
      };
      
      // Save to storage
      const itemsString = JSON.stringify(updatedItems);
      await AsyncStorage.setItem(STORAGE_KEY, itemsString);
      
      // Update state
      setMenuItems(updatedItems);
      console.log('Menu items after adding:', updatedItems);
      
      return newItem;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  const removeMenuItem = async (canteenId: string, itemId: string) => {
    try {
      console.log('Removing item:', { canteenId, itemId });
      const newItems = {
        ...menuItems,
        [canteenId]: menuItems[canteenId]?.filter(item => item.id !== itemId) || []
      };
      console.log('New items state after removal:', newItems);
      await saveMenuItems(newItems);
      setMenuItems(newItems);
    } catch (error) {
      console.error('Error removing menu item:', error);
      throw error;
    }
  };

  const getMenuItems = async (canteenId: string) => {
    try {
      const savedItems = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Raw saved items in getMenuItems:', savedItems);
      
      if (!savedItems) return [];
      
      const parsedItems = JSON.parse(savedItems);
      return parsedItems[canteenId] || [];
    } catch (error) {
      console.error('Error getting menu items:', error);
      return [];
    }
  };

  const hasMenuItems = (canteenId: string) => {
    return (menuItems[canteenId]?.length || 0) > 0;
  };

  const updateMenuItem = async (canteenId: string, itemId: string, updatedItem: MenuItem) => {
    try {
      const newItems = {
        ...menuItems,
        [canteenId]: menuItems[canteenId]?.map(item => 
          item.id === itemId ? updatedItem : item
        ) || []
      };
      await saveMenuItems(newItems);
      setMenuItems(newItems);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  return (
    <VendorContext.Provider value={{ 
      menuItems, 
      addMenuItem, 
      removeMenuItem, 
      getMenuItems,
      hasMenuItems,
      loadMenuItems,
      canteenName: 'Default Canteen',
      updateMenuItem
    }}>
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
} 