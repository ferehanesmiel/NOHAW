
import * as React from 'react';
import { User, UserRole } from '../types';
import { auth, db, googleProvider } from '../firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged,
    signInWithPopup,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password?: string, isGoogleSignIn?: boolean) => Promise<boolean>;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signOut: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateProfile: (details: Partial<Pick<User, 'username' | 'bio' | 'profilePictureUrl'>>) => Promise<void>;
  updateUserDetails: (userId: string, details: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extra user details from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        try {
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
            } else {
                // Fallback for google sign in first time if not caught in signIn
                const newUser: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    username: firebaseUser.displayName || 'User',
                    role: UserRole.USER,
                    profilePictureUrl: firebaseUser.photoURL || undefined
                };
                
                // Attempt to create doc, catch error if offline/permission denied but don't crash app
                try {
                    await setDoc(userDocRef, newUser);
                } catch (writeErr) {
                    console.warn("Could not create user document in Firestore (Offline or Permission issue):", writeErr);
                }
                
                setUser(newUser);
            }
        } catch (error) {
            console.warn("Failed to fetch user data (Offline or Config issue). Falling back to basic Auth profile.", error);
            // Fallback to basic auth info so app works offline
            setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                username: firebaseUser.displayName || 'User',
                role: UserRole.USER,
                profilePictureUrl: firebaseUser.photoURL || undefined
            });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password?: string, isGoogleSignIn = false): Promise<boolean> => {
    try {
        if (isGoogleSignIn) {
            await signInWithPopup(auth, googleProvider);
            // onAuthStateChanged will handle the rest
            return true;
        }

        if (password) {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Sign in error", error);
        return false;
    }
  };

  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: User = {
            id: userCredential.user.uid,
            email,
            username,
            role: UserRole.USER, // Default role
        };
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        return true;
    } catch (error) {
        console.error("Sign up error", error);
        return false;
    }
  };
  
  const updateProfile = async (details: Partial<Pick<User, 'username' | 'bio' | 'profilePictureUrl'>>) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.id);
        await updateDoc(userDocRef, details);
      } catch (e) {
          console.error("Failed to update firestore profile", e);
      }
      setUser(prev => prev ? ({ ...prev, ...details }) : null);
    }
  };

  const updateUserDetails = async (userId: string, details: Partial<User>) => {
      // Admin function to update other users
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, details);
      // If updating self
      if(user && user.id === userId) {
          setUser(prev => prev ? ({ ...prev, ...details }) : null);
      }
  };
  
  const deleteUser = (userId: string) => {
      // Note: deleting users from Auth requires Admin SDK (backend). 
      // From client, we can only delete data from Firestore or delete the CURRENTLY logged in user.
      // For this demo, we will just alert.
      alert("Deleting users requires backend Admin SDK integration in a real production environment. In this demo, you can only manage Firestore data.");
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!auth.currentUser || !auth.currentUser.email) return false;
    
    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        return true;
    } catch (e) {
        console.error("Password change failed", e);
        return false;
    }
  };

  const signOut = () => {
    firebaseSignOut(auth);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAuthenticated, isAdmin, updateProfile, updateUserDetails, deleteUser, changePassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
