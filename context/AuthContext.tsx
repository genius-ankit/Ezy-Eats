import React, { createContext, useContext, useState } from 'react';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  type: 'user' | 'vendor';
  name?: string;
  canteenId?: string;
  businessName?: string;
  ownerName?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: 'user' | 'vendor') => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data - make it mutable
let MOCK_USERS: Record<string, any> = {
  'test@user.com': { 
    password: 'test123', 
    id: 'u1', 
    type: 'user',
    name: 'Test User' 
  },
  'test@vendor.com': { 
    password: 'test123', 
    id: 'v1', 
    type: 'vendor', 
    canteenId: 'canteen1',
    businessName: 'Test Canteen',
    ownerName: 'Test Owner',
    phone: '1234567890'
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, type: 'user' | 'vendor') => {
    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const mockUser = MOCK_USERS[email];
    console.log('Attempting login with:', { email, type });
    console.log('Found user:', mockUser);
    
    if (mockUser && mockUser.password === password && mockUser.type === type) {
      const userData: User = {
        id: mockUser.id,
        email,
        type: mockUser.type,
        name: mockUser.name,
        canteenId: mockUser.canteenId,
        businessName: mockUser.businessName,
        ownerName: mockUser.ownerName,
        phone: mockUser.phone,
      };
      setUser(userData);
      
      if (type === 'vendor') {
        router.replace({
          pathname: '/vendor/dashboard/[canteenId]',
          params: { canteenId: mockUser.canteenId }
        });
      } else {
        router.replace('/(tabs)');
      }
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    // Basic validation
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }

    // Check if user already exists
    if (MOCK_USERS[userData.email]) {
      throw new Error('Email already registered');
    }

    // Create new user with all required fields
    const newUser = {
      id: Math.random().toString(),
      email: userData.email,
      password: userData.password, // Important: include password
      type: userData.type!,
      name: userData.name,
      canteenId: userData.type === 'vendor' ? Math.random().toString() : undefined,
      businessName: userData.businessName,
      ownerName: userData.ownerName,
      phone: userData.phone,
    };

    // Save to mock database
    MOCK_USERS[userData.email] = newUser;
    console.log('Registered new user:', newUser);

    // Redirect to appropriate login
    if (userData.type === 'vendor') {
      router.replace('/vendor/login');
    } else {
      router.replace('/auth/login');
    }
  };

  const logout = () => {
    setUser(null);
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 