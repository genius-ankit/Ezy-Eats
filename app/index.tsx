import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Link, router } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EzyEats</Text>
      <View style={styles.buttonContainer}>
        <Link href="/(tabs)/scan" style={styles.link}>Scan QR Code</Link>
      </View>
      <Pressable 
        style={styles.adminButton}
        onPress={() => router.push('/admin/generate-qr')}
      >
        <Text style={styles.adminButtonText}>Generate QR Codes</Text>
      </Pressable>
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
    width: 200,
  },
  adminButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  adminButtonText: {
    color: 'white',
    fontWeight: '600',
  },
}); 