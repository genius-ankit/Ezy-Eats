import { View, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    phoneNumber: '',
    studentId: '',
    department: '',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      if (user?.uid) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      }
    } catch (error: any) {
      setError('Failed to load profile');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, profileData);
        setIsEditing(false);
      }
    } catch (error: any) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {profileData.name ? profileData.name[0].toUpperCase() : 'S'}
            </ThemedText>
          </View>
          {!isEditing && (
            <Pressable 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <MaterialIcons name="edit" size={20} color="#007AFF" />
              <ThemedText style={styles.editText}>Edit Profile</ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {error && (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <BlurView intensity={80} style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={profileData.name}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
                editable={isEditing}
                placeholder="Enter your full name"
              />
            </BlurView>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Phone Number</ThemedText>
            <BlurView intensity={80} style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={profileData.phoneNumber}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, phoneNumber: text }))}
                editable={isEditing}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </BlurView>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Student ID</ThemedText>
            <BlurView intensity={80} style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={profileData.studentId}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, studentId: text }))}
                editable={isEditing}
                placeholder="Enter your student ID"
              />
            </BlurView>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Department</ThemedText>
            <BlurView intensity={80} style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={profileData.department}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, department: text }))}
                editable={isEditing}
                placeholder="Enter your department"
              />
            </BlurView>
          </View>

          {isEditing && (
            <View style={styles.buttonGroup}>
              <Pressable 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  loadUserProfile();
                }}
              >
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable 
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                <ThemedText style={styles.buttonText}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </ThemedText>
              </Pressable>
            </View>
          )}
        </View>

        <Pressable 
          style={styles.logoutButton}
          onPress={logout}
        >
          <MaterialIcons name="logout" size={20} color="#FF3B30" />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
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
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editText: {
    color: '#007AFF',
    marginLeft: 4,
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  inputWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E5EA',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 40,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
  },
  logoutText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
}); 