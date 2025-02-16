import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
  withRepeat,
} from 'react-native-reanimated';
import { SplashScreen as ExpoSplashScreen } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export function SplashScreen() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-40);

  useEffect(() => {
    // Hide the native splash screen
    ExpoSplashScreen.hideAsync();

    // Start animations
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSequence(
      withTiming(1.2, { duration: 400 }),
      withSpring(1, { damping: 8 })
    );

    // Add loading animation
    translateX.value = withRepeat(
      withTiming(40, { duration: 1000 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <ThemedText style={styles.title}>Eazy Eats</ThemedText>
        <View style={styles.loaderContainer}>
          <Animated.View 
            style={[
              styles.loader, 
              { transform: [{ translateX: translateX }] }
            ]} 
          />
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loaderContainer: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loader: {
    width: '100%',
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
}); 