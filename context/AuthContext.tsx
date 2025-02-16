import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '@/config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role: 'student' | 'chef') => Promise<void>;
  signUp: (email: string, password: string, role: 'student' | 'chef', userData: any) => Promise<void>;
  logout: () => Promise<void>;
  userRole: 'student' | 'chef' | null;
  authError: AuthError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthError {
  code: string;
  message: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'student' | 'chef' | null>(null);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email); // Debug log
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          console.log('Fetched user data:', userDoc.data()); // Debug log
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role && ['student', 'chef'].includes(userData.role)) {
              setUserRole(userData.role);
              setUser(user);
            } else {
              console.error('Invalid role:', userData.role); // Debug log
              await signOut(auth);
              setUser(null);
              setUserRole(null);
            }
          } else {
            console.error('No user document found'); // Debug log
            await signOut(auth);
            setUser(null);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error); // Debug log
          await signOut(auth);
          setUser(null);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = () => setAuthError(null);

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    let message = 'An unexpected error occurred';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address format';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/operation-not-allowed':
        message = 'Sign up is currently disabled';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'invalid-role':
        message = `This account is not registered as a ${error.attemptedRole}`;
        break;
    }

    setAuthError({ code: error.code, message });
    return message;
  };

  const signUp = async (email: string, password: string, role: 'student' | 'chef', userData: any) => {
    try {
      clearError();
      console.log('Starting signup with:', { email, role, userData }); // Debug log

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocData = {
        uid: user.uid,
        email: user.email,
        role: role, // Explicitly set role
        name: userData.name,
        createdAt: new Date().toISOString()
      };

      console.log('Creating user document:', userDocData); // Debug log

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), userDocData);

      // Set role immediately after successful document creation
      setUserRole(role);
      
      return user;
    } catch (error: any) {
      const message = handleAuthError(error);
      throw new Error(message);
    }
  };

  const signIn = async (email: string, password: string, role: 'student' | 'chef') => {
    try {
      clearError();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verify user role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      console.log('User data from Firestore:', userData); // Add this for debugging

      if (!userData || userData.role !== role) {
        console.log('Role mismatch:', { expected: role, found: userData?.role }); // Add this for debugging
        await signOut(auth);
        throw new Error(`Invalid account type. Please use the ${role} login.`);
      }

      setUserRole(role);
    } catch (error: any) {
      const message = handleAuthError({ ...error, attemptedRole: role });
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      logout, 
      userRole,
      authError,
      clearError 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 