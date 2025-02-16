import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function ErrorScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <MaterialIcons name="error" size={60} color="#FF3B30" />
      <ThemedText style={styles.title}>Invalid Account Type</ThemedText>
      <ThemedText style={styles.message}>
        Your account type is not recognized. Please contact support or try logging in with a different account.
      </ThemedText>
      <Pressable style={styles.button} onPress={logout}>
        <ThemedText style={styles.buttonText}>Logout</ThemedText>
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
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 