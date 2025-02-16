import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { CartProvider } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { LoginScreen } from '@/components/LoginScreen';
import * as SplashScreenExpo from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Prevent auto-hiding of splash screen
SplashScreenExpo.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, userRole, loading } = useAuth();
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2500));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  // Prevent navigation until auth is ready
  if (!isReady || loading) {
    return <SplashScreen />;
  }

  // Force login screen if no user
  if (!user) {
    return <LoginScreen />;
  }

  // Handle invalid role
  if (!userRole || !['student', 'chef'].includes(userRole)) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="error" />
      </Stack>
    );
  }

  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        }}>
        {userRole === 'student' ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen 
            name="chef/dashboard" 
            options={{ 
              title: 'Kitchen Dashboard',
              headerShown: true 
            }} 
          />
        )}
      </Stack>
    </CartProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
