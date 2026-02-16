
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDo0ZdE3vNmUpTBkQzBwq1v-1MSzYbTjsc",
  authDomain: "nohaw-2aac1.firebaseapp.com",
  projectId: "nohaw-2aac1",
  storageBucket: "nohaw-2aac1.firebasestorage.app",
  messagingSenderId: "107300660107",
  appId: "1:107300660107:web:0b5cc05a88b12265f4c58e",
  measurementId: "G-XLNQ5KBLRE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics conditionally to avoid "s is not a function" errors if it fails to load or isn't supported
let analytics = null;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn("Firebase Analytics failed to initialize:", e);
}
export { analytics };

// Initialize Firestore with persistent local cache to handle offline scenarios
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});

export const storage = getStorage(app);
