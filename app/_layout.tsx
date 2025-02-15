import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
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
            title: 'EzyEats',  // This will show EzyEats instead of index
            headerShown: true 
          }} 
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="menu/[canteenId]/[menuId]" 
          options={{ title: 'Menu' }} 
        />
        <Stack.Screen name="cart" options={{ title: 'Cart' }} />
        <Stack.Screen 
          name="payment" 
          options={{ 
            title: 'Complete Payment',
            headerBackTitle: 'Back to Cart'
          }} 
        />
      </Stack>
    </CartProvider>
  );
}
