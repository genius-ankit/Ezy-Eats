import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface VendorData {
  password: string;
  canteenId: string;
}

// Expanded mock data for testing
const MOCK_VENDORS: Record<string, VendorData> = {
  'vendor1@test.com': { password: 'test123', canteenId: 'canteen1' },
  'test@vendor.com': { password: 'password123', canteenId: 'canteen2' },
};

export default function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setError('');
      await login(email, password, 'vendor');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleTestLogin = async () => {
    try {
      setError('');
      setEmail('test@vendor.com');
      setPassword('test123');
      await login('test@vendor.com', 'test123', 'vendor');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Login</Text>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>

      <Pressable style={styles.testLoginButton} onPress={handleTestLogin}>
        <Text style={styles.testLoginText}>Use Test Account</Text>
      </Pressable>

      <View style={styles.testCredentials}>
        <Text style={styles.testCredentialsText}>Test Credentials:</Text>
        <Text style={styles.credentialText}>Email: test@vendor.com</Text>
        <Text style={styles.credentialText}>Password: test123</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have a vendor account? </Text>
        <Link href="/auth/vendor-register" style={styles.link}>
          Register here
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  testLoginButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  testLoginText: {
    color: '#2E8B57',
    fontSize: 16,
    fontWeight: '600',
  },
  testCredentials: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  testCredentialsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  credentialText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
  },
  link: {
    color: '#2E8B57',
    fontWeight: '600',
  },
}); 