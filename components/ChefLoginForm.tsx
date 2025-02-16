import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useState } from 'react';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { LoadingSpinner } from './LoadingSpinner';

export function ChefLoginForm({ onBack }: { onBack: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signIn(email, password, 'chef');
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'invalid-role':
          setError('This email is not registered as a chef account');
          break;
        default:
          setError(error.message || 'Failed to sign in');
      }
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
          disabled={loading}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.chef} />
          <ThemedText style={[styles.backText, { color: Colors.chef }]}>
            Back
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="restaurant" size={32} color={Colors.chef} />
          </View>
          <ThemedText style={[styles.title, { color: Colors.chef }]}>
            Chef Login
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Access your kitchen dashboard
          </ThemedText>
        </View>

        <View style={styles.form}>
          <BlurView intensity={90} style={[styles.inputWrapper, error && styles.inputError]}>
            <MaterialIcons name="email" size={20} color={Colors.text.secondary} />
            <TextInput
              placeholder="Chef Email"
              style={styles.input}
              placeholderTextColor={Colors.text.secondary}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </BlurView>

          <BlurView intensity={90} style={[styles.inputWrapper, error && styles.inputError]}>
            <MaterialIcons name="lock" size={20} color={Colors.text.secondary} />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor={Colors.text.secondary}
              value={password}
              onChangeText={setPassword}
            />
          </BlurView>

          {error && (
            <Animated.View 
              entering={FadeIn}
              style={styles.errorContainer}
            >
              <MaterialIcons name="error" size={16} color={Colors.primary} />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </Animated.View>
          )}

          <Pressable 
            style={({ pressed }) => [
              styles.loginButton,
              loading && styles.loginButtonDisabled,
              pressed && styles.buttonPressed
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner color={Colors.text.light} />
            ) : (
              <ThemedText style={styles.loginButtonText}>
                Sign In
              </ThemedText>
            )}
          </Pressable>

          <Pressable style={styles.forgotPassword}>
            <ThemedText style={[styles.forgotPasswordText, { color: Colors.chef }]}>
              Forgot Password?
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
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 120 : 100,
    justifyContent: 'center',
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
    paddingHorizontal: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${Colors.chef}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    includeFontPadding: false,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    includeFontPadding: false,
    lineHeight: 20,
  },
  form: {
    gap: 16,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: 16,
    backgroundColor: Colors.input.background,
  },
  inputError: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 14,
  },
  loginButton: {
    height: 56,
    backgroundColor: Colors.chef,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.chef,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.text.secondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    color: Colors.text.light,
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  forgotPasswordText: {
    fontSize: 15,
    fontWeight: '500',
  },
}); 