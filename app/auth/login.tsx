import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setError('');
      if (!email || !password) {
        setError('All fields are required');
        return;
      }
      await login(email, password, 'user');
      router.replace('/user/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleTestLogin = async () => {
    try {
      setError('');
      setEmail('test@user.com');
      setPassword('test123');
      await login('test@user.com', 'test123', 'user');
      router.replace('/user/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
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
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable style={styles.testLoginButton} onPress={handleTestLogin}>
        <Text style={styles.testLoginText}>Use Test Account</Text>
      </Pressable>

      <View style={styles.testCredentials}>
        <Text style={styles.testCredentialsText}>Test Credentials:</Text>
        <Text style={styles.credentialText}>Email: test@user.com</Text>
        <Text style={styles.credentialText}>Password: test123</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/auth/register" style={styles.link}>
          Register
        </Link>
      </View>
      
      <View style={styles.vendorSection}>
        <Text style={styles.vendorText}>Are you a vendor?</Text>
        <Link href="/vendor/login" style={styles.link}>
          Login as Vendor
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  vendorSection: {
    alignItems: 'center',
    marginTop: 48,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  vendorText: {
    color: '#666',
    marginBottom: 8,
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
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
}); 