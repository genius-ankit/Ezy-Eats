import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useState } from 'react';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';

export function SignUpScreen({ role, onBack }: { 
  role: 'student' | 'chef';
  onBack: () => void;
}) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    // Validate inputs
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const userData = {
        name: name.trim(),
        // Only include essential data
      };

      console.log('Attempting signup with:', { email, role, userData }); // Debug log
      
      await signUp(email, password, role, userData);
    } catch (error: any) {
      console.error('Signup error in component:', error); // Debug log
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <MaterialIcons 
            name="arrow-back" 
            size={24} 
            color={role === 'student' ? '#007AFF' : '#2E8B57'} 
          />
          <ThemedText style={[styles.backText, { 
            color: role === 'student' ? '#007AFF' : '#2E8B57' 
          }]}>Back</ThemedText>
        </Pressable>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.titleContainer}>
          <MaterialIcons 
            name={role === 'student' ? 'school' : 'restaurant'} 
            size={40} 
            color={role === 'student' ? '#007AFF' : '#2E8B57'}
          />
          <ThemedText style={[styles.title, { 
            color: role === 'student' ? '#007AFF' : '#2E8B57' 
          }]}>Create Account</ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign up as a {role}
          </ThemedText>
        </View>

        <View style={styles.form}>
          <BlurView intensity={80} style={styles.inputWrapper}>
            <MaterialIcons name="person" size={20} color="#666" />
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
          </BlurView>

          <BlurView intensity={80} style={styles.inputWrapper}>
            <MaterialIcons name="email" size={20} color="#666" />
            <TextInput
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#666"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </BlurView>

          <BlurView intensity={80} style={styles.inputWrapper}>
            <MaterialIcons name="lock" size={20} color="#666" />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
            />
          </BlurView>

          {error && (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          )}

          <Pressable 
            style={[
              styles.signUpButton, 
              loading && styles.signUpButtonDisabled,
              { backgroundColor: role === 'student' ? '#007AFF' : '#2E8B57' }
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <ThemedText style={styles.signUpButtonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 100 : 80,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    fontSize: 17,
    marginLeft: 4,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    gap: 16,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  signUpButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 10,
  }
}); 