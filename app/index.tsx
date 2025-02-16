import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EzyEats</Text>
      
      {/* Main Actions */}
      <View style={styles.buttonContainer}>
        <Link href="/auth/login" style={styles.mainButton}>
          <Text style={styles.buttonText}>Login</Text>
        </Link>
        <Link href="/auth/register" style={styles.mainButton}>
          <Text style={styles.buttonText}>Register</Text>
        </Link>
      </View>

      {/* Vendor Section */}
      <View style={styles.vendorSection}>
        <Text style={styles.sectionTitle}>For Vendors</Text>
        <View style={styles.buttonContainer}>
          <Link href="/vendor/login" style={styles.vendorButton}>
            <Text style={styles.buttonText}>Vendor Login</Text>
          </Link>
          <Link href="/auth/vendor-register" style={styles.vendorButton}>
            <Text style={styles.buttonText}>Register as Vendor</Text>
          </Link>
        </View>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  mainButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  vendorButton: {
    backgroundColor: '#1E5837',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  vendorSection: {
    marginTop: 40,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
}); 