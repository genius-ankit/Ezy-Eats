import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: true
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Register',
          headerShown: true
        }}
      />
      <Stack.Screen
        name="vendor-login"
        options={{
          title: 'Vendor Login',
          headerShown: true
        }}
      />
      <Stack.Screen
        name="vendor-register"
        options={{
          title: 'Vendor Registration',
          headerShown: true
        }}
      />
    </Stack>
  );
} 