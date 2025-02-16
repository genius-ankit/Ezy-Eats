import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isVeg?: boolean;
  available?: boolean;
}

interface MenuContextType {
  getMenuItems: (canteenId: string) => MenuItem[];
  addMenuItem: (canteenId: string, item: Omit<MenuItem, 'id'>) => Promise<void>;
  removeMenuItem: (canteenId: string, itemId: string) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const STORAGE_KEY = '@ezyeats_menu_database';

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuDatabase, setMenuDatabase] = useState<Record<string, MenuItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load saved menu data when the app starts
  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setIsLoading(true);
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Loading menu data from storage...');
      console.log('Raw saved data:', savedData);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('Successfully parsed menu database:', parsedData);
        setMenuDatabase(parsedData);
      } else {
        console.log('No saved menu data found');
        setMenuDatabase({});
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
      setMenuDatabase({});
    } finally {
      setIsLoading(false);
    }
  };

  const saveMenuData = async (data: Record<string, MenuItem[]>) => {
    try {
      const jsonData = JSON.stringify(data);
      console.log('Saving menu data to storage:', jsonData);
      await AsyncStorage.setItem(STORAGE_KEY, jsonData);
      console.log('Menu data saved successfully');
    } catch (error) {
      console.error('Error saving menu data:', error);
      throw new Error('Failed to save menu data');
    }
  };

  const getMenuItems = (canteenId: string) => {
    console.log('Getting menu items for canteen:', canteenId);
    console.log('Current menu database:', JSON.stringify(menuDatabase, null, 2));
    const items = menuDatabase[canteenId] || [];
    console.log('Retrieved items for canteen:', items);
    return items;
  };

  const addMenuItem = async (canteenId: string, item: Omit<MenuItem, 'id'>) => {
    console.log('Adding menu item for canteen:', canteenId);
    console.log('Item details:', item);
    
    const newItem = {
      ...item,
      id: Date.now().toString(), // Using timestamp for more reliable unique IDs
      available: true,
    };

    const updatedDatabase = { 
      ...menuDatabase,
      [canteenId]: [...(menuDatabase[canteenId] || []), newItem]
    };
    
    console.log('Updated database:', JSON.stringify(updatedDatabase, null, 2));
    
    try {
      await saveMenuData(updatedDatabase);
      setMenuDatabase(updatedDatabase);
      console.log('Menu item added successfully');
    } catch (error) {
      console.error('Failed to add menu item:', error);
      throw error;
    }
  };

  const removeMenuItem = async (canteenId: string, itemId: string) => {
    console.log('Removing menu item:', itemId, 'from canteen:', canteenId);
    
    if (menuDatabase[canteenId]) {
      const updatedDatabase = {
        ...menuDatabase,
        [canteenId]: menuDatabase[canteenId].filter(item => item.id !== itemId)
      };
      
      try {
        await saveMenuData(updatedDatabase);
        setMenuDatabase(updatedDatabase);
        console.log('Menu item removed successfully');
      } catch (error) {
        console.error('Failed to remove menu item:', error);
        throw error;
      }
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <MenuContext.Provider value={{ getMenuItems, addMenuItem, removeMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
} 