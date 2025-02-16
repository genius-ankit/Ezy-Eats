import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  SlideInDown, 
  SlideOutUp,
  FadeIn,
  FadeOut 
} from 'react-native-reanimated';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <Animated.View 
      entering={SlideInDown.springify().damping(15)}
      exiting={SlideOutUp.springify()}
      style={styles.container}
    >
      <Animated.View 
        entering={FadeIn}
        style={styles.content}
      >
        <MaterialIcons name="error" size={24} color="#fff" />
        <ThemedText style={styles.message}>{message}</ThemedText>
      </Animated.View>
      <Pressable 
        onPress={onDismiss} 
        style={styles.dismissButton}
        hitSlop={20}
      >
        <MaterialIcons name="close" size={20} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  dismissButton: {
    padding: 4,
  },
}); 