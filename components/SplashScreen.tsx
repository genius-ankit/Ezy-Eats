import { useEffect } from 'react';
import { StyleSheet, View, useColorScheme, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import * as SplashScreenExpo from 'expo-splash-screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';

export function SplashScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const progress = useSharedValue(0);
  const scale = useSharedValue(0.3);
  const textScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    SplashScreenExpo.hideAsync();

    progress.value = withTiming(1, { 
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
      velocity: 2,
    });

    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    textScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
      mass: 0.5,
    });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.5, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [50, 0]) },
      { scale: textScale.value }
    ],
  }));

  return (
    <ThemedView style={styles.container}>
      <View style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <MaterialIcons 
              name="restaurant-menu" 
              size={60} 
              color={isDark ? '#fff' : '#000'} 
            />
          </Animated.View>

          <Animated.View style={[styles.textContainer, textStyle]}>
            <ThemedText style={styles.title}>Eazy Eats</ThemedText>
            <ThemedText style={styles.subtitle}>Delicious Food, Delivered</ThemedText>
          </Animated.View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  logoContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
    includeFontPadding: false,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: '500',
    lineHeight: 24,
  },
}); 