import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAS86Yxl8R8ICogQKJfA9bxYw839vedzLc",
  authDomain: "eazy-eats-b687a.firebaseapp.com",
  projectId: "eazy-eats-b687a",
  storageBucket: "eazy-eats-b687a.appspot.com",
  messagingSenderId: "1062713318683",
  appId: "..." // Add your actual appId here
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { auth, db }; 