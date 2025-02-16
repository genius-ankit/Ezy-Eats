import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';

export default function ChefDashboard() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Kitchen Dashboard</ThemedText>
      {/* Add dashboard content */}
      <Pressable onPress={logout} style={styles.logoutButton}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
  },
}); 