import { useState } from 'react';
import { StyleSheet, View, Pressable, Platform, Dimensions } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { BlurView } from 'expo-blur';
import { StudentLoginForm } from './StudentLoginForm';
import { ChefLoginForm } from './ChefLoginForm';
import { SignUpScreen } from './SignUpScreen';
import { useAuth } from '@/context/AuthContext';
import { ErrorAlert } from './ErrorAlert';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Define a consistent color palette
const Colors = {
  primary: '#FF6B6B', // Warm red for main actions
  secondary: '#4ECDC4', // Teal for secondary actions
  student: '#FF8787', // Soft red for student theme
  chef: '#45B7AF', // Soft teal for chef theme
  background: '#F8F9FA', // Light gray background
  text: {
    primary: '#212529', // Dark gray for primary text
    secondary: '#868E96', // Medium gray for secondary text
    light: '#F8F9FA', // Light gray for text on dark backgrounds
  },
  border: {
    light: 'rgba(0, 0, 0, 0.1)',
  }
};

type UserRole = 'student' | 'chef' | null;

const RoleButton = ({ 
  role, 
  icon, 
  description, 
  onPress, 
  color 
}: { 
  role: 'student' | 'chef';
  icon: keyof typeof MaterialIcons.glyphMap;
  description: string;
  onPress: () => void;
  color: string;
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.roleButton,
      { borderColor: `${color}30` },
      pressed && styles.buttonPressed
    ]}
    onPress={onPress}
  >
    <View style={[styles.roleContent, { backgroundColor: `${color}08` }]}>
      <View style={[styles.roleIconBg, { backgroundColor: `${color}15` }]}>
        <MaterialIcons name={icon} size={28} color={color} />
      </View>
      <ThemedText style={[styles.roleDescription, { color }]}>
        {description}
      </ThemedText>
    </View>
  </Pressable>
);

export function LoginScreen() {
  const { authError, clearError } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleRoleSelect = async (role: UserRole) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedRole(role);
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRole(null);
  };

  const handleToggleSignUp = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSignUp(!showSignUp);
  };

  const renderRoleSelection = () => (
    <Animated.View 
      entering={FadeIn.duration(500)}
      style={styles.mainContainer}
    >
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <MaterialIcons 
            name="restaurant-menu" 
            size={32} 
            color={Colors.primary} 
          />
        </View>
        <ThemedText style={styles.appName}>Eazy Eats</ThemedText>
        <ThemedText style={styles.tagline}>Campus Food Made Simple</ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.sectionTitle}>Login as</ThemedText>
        
        <View style={styles.rolesGrid}>
          <RoleButton
            role="student"
            icon="school"
            description="Order Food"
            color={Colors.student}
            onPress={() => handleRoleSelect('student')}
          />
          <RoleButton
            role="chef"
            icon="restaurant"
            description="Manage Kitchen"
            color={Colors.chef}
            onPress={() => handleRoleSelect('chef')}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>or</ThemedText>
          <View style={styles.dividerLine} />
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.createAccountButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleToggleSignUp}
        >
          <ThemedText style={styles.createAccountText}>
            Create New Account
          </ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderAuthForm = () => (
    <Animated.View
      entering={SlideInUp.springify().damping(15)}
      exiting={SlideOutDown.springify()}
      style={styles.formContainer}
    >
      {showSignUp ? (
        <SignUpScreen 
          role={selectedRole!} 
          onBack={handleToggleSignUp}
        />
      ) : selectedRole === 'student' ? (
        <StudentLoginForm onBack={handleBack} />
      ) : (
        <ChefLoginForm onBack={handleBack} />
      )}
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      {authError && (
        <ErrorAlert 
          message={authError.message}
          onDismiss={clearError}
        />
      )}

      <View style={styles.background}>
        <BlurView intensity={95} style={StyleSheet.absoluteFill} />
      </View>

      {selectedRole ? renderAuthForm() : renderRoleSelection()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
    paddingTop: 20,
  },
  logoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    includeFontPadding: false,
    lineHeight: 40,
  },
  tagline: {
    fontSize: 15,
    color: Colors.text.secondary,
    includeFontPadding: false,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  rolesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  roleButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  roleContent: {
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  roleIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleDescription: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.light,
  },
  dividerText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  createAccountButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  createAccountText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
}); 