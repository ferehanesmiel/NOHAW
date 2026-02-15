
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
import { doc, getDoc, setDoc } from 'firebase/firestore';

type AuthResponse = {
    success: boolean;
    message?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password?: string, isGoogleSignIn?: boolean) => Promise<AuthResponse>;
  signUp: (email: string, password: string, username: string) => Promise<AuthResponse>;
  signOut: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateProfile: (details: Partial<Pick<User, 'username' | 'bio' | 'profilePictureUrl'>>) => Promise<void>;
  updateUserDetails: (userId: string, details: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Helper to remove undefined values because Firestore does not support them
const sanitizeData = (data: any) => {
  const cleaned: any = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      cleaned[key] = data[key];
    }
  });
  return cleaned;
};

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 1. Setup default user object from Auth data
        const baseUser: any = {
             id: firebaseUser.uid,
             email: firebaseUser.email || '',
             username: firebaseUser.displayName || 'User',
             role: UserRole.USER,
        };
        
        if (firebaseUser.photoURL) {
            baseUser.profilePictureUrl = firebaseUser.photoURL;
        }

        let finalUser: User = baseUser as User;

        try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                finalUser = { 
                    ...finalUser, 
                    ...userData,
                    role: (userData.role as UserRole) || UserRole.USER 
                } as User;
            } else {
                // If no profile exists, create one safely
                try {
                    await setDoc(userDocRef, sanitizeData(finalUser));
                } catch (writeErr) {
                    console.error("Error creating user profile:", writeErr);
                }
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }

        setUser(finalUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password?: string, isGoogleSignIn = false): Promise<AuthResponse> => {
    try {
        if (isGoogleSignIn) {
            await signInWithPopup(auth, googleProvider);
            return { success: true };
        }

        if (password) {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        }
        return { success: false, message: "Password is required." };
    } catch (error: any) {
        console.error("Sign in error:", error.code);
        let message = "Failed to sign in.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "Invalid email or password.";
        }
        return { success: false, message };
    }
  };

  const signUp = async (email: string, password: string, username: string): Promise<AuthResponse> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: User = {
            id: userCredential.user.uid,
            email,
            username,
            role: UserRole.USER,
        };
        
        // Create Firestore document immediately
        try {
            await setDoc(doc(db, 'users', userCredential.user.uid), sanitizeData(newUser));
        } catch (e) {
            console.error("Error creating Firestore profile:", e);
        }
        return { success: true };
    } catch (error: any) {
        console.error("Sign up error", error);
        let message = "Failed to sign up.";
        if (error.code === 'auth/email-already-in-use') message = "Email already in use.";
        return { success: false, message };
    }
  };
  
  const updateProfile = async (details: Partial<Pick<User, 'username' | 'bio' | 'profilePictureUrl'>>) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.id);
        const safeDetails = sanitizeData(details);
        
        // Use setDoc with merge: true to avoid 'No document to update' errors
        await setDoc(userDocRef, safeDetails, { merge: true });
        
        setUser(prev => prev ? ({ ...prev, ...safeDetails }) : null);
      } catch (e) {
          console.error("Failed to update firestore profile", e);
      }
    }
  };

  const updateUserDetails = async (userId: string, details: Partial<User>) => {
      try {
          const userDocRef = doc(db, 'users', userId);
          const safeDetails = sanitizeData(details);
          // Use setDoc with merge: true for robustness
          await setDoc(userDocRef, safeDetails, { merge: true });
          
          if(user && user.id === userId) {
              setUser(prev => prev ? ({ ...prev, ...safeDetails }) : null);
          }
      } catch (e) {
          console.error("Failed to update user details", e);
          throw e;
      }
  };
  
  const deleteUser = (userId: string) => {
      alert("Deleting users requires backend Admin SDK.");
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!auth.currentUser || !auth.currentUser.email) return false;
    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        return true;
    } catch (e) {
        console.error("Error changing password", e);
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
