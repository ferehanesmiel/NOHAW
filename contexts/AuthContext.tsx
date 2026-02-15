
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

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Default object with basic info
        let finalUser: User = {
             id: firebaseUser.uid,
             email: firebaseUser.email || '',
             username: firebaseUser.displayName || 'User',
             role: UserRole.USER, // Default to USER, fetching real role below
             profilePictureUrl: firebaseUser.photoURL || undefined
        };

        // Fetch details from Firestore
        try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                finalUser = { 
                    ...finalUser, 
                    ...userData, 
                    // Ensure role comes from DB, defaulting to USER if missing
                    role: (userData.role as UserRole) || UserRole.USER 
                } as User;
            } else {
                // If user doc doesn't exist (e.g. first Google Sign In), create it
                // Default to USER. You can manually change specific users to ADMIN in Firestore console.
                try {
                    await setDoc(userDocRef, finalUser);
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
        console.error("Sign in error code:", error.code);
        let message = "Failed to sign in.";
        
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "Invalid email or password.";
        } else if (error.code === 'auth/too-many-requests') {
            message = "Too many failed attempts. Please try again later.";
        } else if (error.code === 'auth/network-request-failed') {
            message = "Network error. Check connection.";
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
            role: UserRole.USER, // Default new signups to USER
        };
        try {
            await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        } catch (e) {
            console.error("Error creating Firestore profile for new user:", e);
        }
        return { success: true };
    } catch (error: any) {
        console.error("Sign up error", error);
        let message = "Failed to sign up.";
        if (error.code === 'auth/email-already-in-use') message = "Email already in use.";
        else if (error.code === 'auth/weak-password') message = "Password too weak.";
        else if (error.code === 'auth/invalid-email') message = "Invalid email.";
        return { success: false, message };
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
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, details);
      if(user && user.id === userId) {
          setUser(prev => prev ? ({ ...prev, ...details }) : null);
      }
  };
  
  const deleteUser = (userId: string) => {
      alert("Deleting users requires backend Admin SDK. This is a frontend-only demo action.");
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!auth.currentUser || !auth.currentUser.email) return false;
    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        return true;
    } catch (e) {
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
