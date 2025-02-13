import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EzyEats</Text>
      <View style={styles.buttonContainer}>
        <Link href="/menu" style={styles.link}>View Menu</Link>
        <Link href="/orders" style={styles.link}>My Orders</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
  },
  link: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    color: 'white',
    textAlign: 'center',
  },
}); 