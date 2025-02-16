import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const canteens = [
    { id: '1', name: 'Main Cafeteria', status: 'Open', distance: '2 min' },
    { id: '2', name: 'Science Block Cafe', status: 'Open', distance: '5 min' },
    { id: '3', name: 'Library Cafe', status: 'Closed', distance: '8 min' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.greeting}>Hello, {user?.displayName || 'Student'}</ThemedText>
        <ThemedText style={styles.subtitle}>Find your favorite meal</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Nearby Canteens</ThemedText>
          {canteens.map((canteen) => (
            <Pressable
              key={canteen.id}
              style={styles.canteenCard}
              onPress={() => router.push(`/menu/${canteen.id}/main`)}
            >
              <BlurView intensity={80} style={styles.cardContent}>
                <View style={styles.canteenInfo}>
                  <ThemedText style={styles.canteenName}>{canteen.name}</ThemedText>
                  <View style={styles.detailsRow}>
                    <View style={styles.statusContainer}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: canteen.status === 'Open' ? '#4CAF50' : '#FF3B30' }
                      ]} />
                      <ThemedText style={styles.statusText}>{canteen.status}</ThemedText>
                    </View>
                    <View style={styles.distanceContainer}>
                      <MaterialIcons name="directions-walk" size={16} color="#666" />
                      <ThemedText style={styles.distanceText}>{canteen.distance}</ThemedText>
                    </View>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </BlurView>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.quickActions}>
            <Pressable 
              style={styles.actionButton}
              onPress={() => router.push('/orders')}
            >
              <MaterialIcons name="receipt" size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>Orders</ThemedText>
            </Pressable>
            
            <Pressable 
              style={styles.actionButton}
              onPress={() => router.push('/scan')}
            >
              <MaterialIcons name="qr-code-scanner" size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>Scan QR</ThemedText>
            </Pressable>

            <Pressable 
              style={styles.actionButton}
              onPress={() => router.push('/profile')}
            >
              <MaterialIcons name="person" size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>Profile</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  canteenCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  canteenInfo: {
    flex: 1,
  },
  canteenName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flex: 0,
  },
  actionText: {
    marginTop: 8,
    fontSize: 15,
    color: '#007AFF',
  },
}); 