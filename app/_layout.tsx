import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { VendorProvider } from '@/context/VendorContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <VendorProvider>
        <CartProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
              },
              headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{ 
                title: 'EzyEats',
                headerShown: true 
              }} 
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="menu/[canteenId]/[menuId]" 
              options={{ 
                title: 'Menu',
                headerShown: true 
              }} 
            />
            <Stack.Screen name="cart" options={{ title: 'Cart' }} />
            <Stack.Screen 
              name="payment" 
              options={{ 
                title: 'Complete Payment',
                headerBackTitle: 'Back to Cart'
              }} 
            />
            
            {/* Auth Routes */}
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            
            {/* Vendor Routes */}
            <Stack.Screen
              name="vendor/login"
              options={{ 
                title: 'Vendor Login'
              }}
            />
            <Stack.Screen
              name="vendor/dashboard/[canteenId]"
              options={({ route }) => ({ 
                title: 'Vendor Portal',
                headerBackVisible: false,
                headerShown: true
              })}
            />
            <Stack.Screen
              name="vendor/menu/[canteenId]"
              options={({ route }) => ({
                title: 'Menu Editor'
              })}
            />
            <Stack.Screen
              name="vendor/generate-qr/[canteenId]"
              options={({ route }) => ({
                title: 'QR Code Generator'
              })}
            />
            
            {/* User Routes */}
            <Stack.Screen 
              name="user/dashboard" 
              options={{ 
                title: 'Home',
                headerBackVisible: false,
                headerShown: true
              }} 
            />
            <Stack.Screen 
              name="scan" 
              options={{ 
                title: 'Scan Menu',
                presentation: 'modal'
              }} 
            />
          </Stack>
        </CartProvider>
      </VendorProvider>
    </AuthProvider>
  );
}
