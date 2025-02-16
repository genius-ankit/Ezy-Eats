import Animated, { 
  withRepeat, 
  withTiming,
  useAnimatedStyle,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

export function LoadingSpinner({ color = '#007AFF' }) {
  const dots = [0, 1, 2].map(index => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{
          scale: withRepeat(
            withSequence(
              withDelay(
                index * 200,
                withTiming(1.2, { duration: 300 })
              ),
              withTiming(1, { duration: 300 })
            ),
            -1,
            true
          )
        }]
      };
    });

    return (
      <Animated.View 
        key={index}
        style={[
          styles.dot,
          { backgroundColor: color },
          animatedStyle
        ]}
      />
    );
  });

  return (
    <View style={styles.container}>
      {dots}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}); 