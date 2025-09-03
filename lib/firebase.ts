import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, type FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { getPerformance } from 'firebase/performance';

declare global {
  // eslint-disable-next-line no-var
  var __KOLAKE_FB__: { app: FirebaseApp; auth: Auth; db: Firestore; storage: FirebaseStorage; googleProvider: GoogleAuthProvider } | undefined;
}

function createFirebaseApp() {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };

  // Use existing app or create new one
  const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const googleProvider = new GoogleAuthProvider();

  // Initialize Performance monitoring in production
  let performance;
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    performance = getPerformance(app);
  }

  // Connect to emulators if in development and not already connected
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // @ts-ignore
    if (!window.__FIREBASE_EMULATORS_CONNECTED__) {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectStorageEmulator(storage, 'localhost', 9199);
        // @ts-ignore
        window.__FIREBASE_EMULATORS_CONNECTED__ = true;
      } catch (error) {
        // Emulators already connected, ignore
      }
    }
  }

  return { app, auth, db, storage, googleProvider };
}

// Use global singleton to prevent "app already exists" error
export const { app, auth, db, storage, googleProvider } = 
  globalThis.__KOLAKE_FB__ ?? (globalThis.__KOLAKE_FB__ = createFirebaseApp());