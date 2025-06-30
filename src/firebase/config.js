// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKh6ifKk0fXQlAy-ixQq-JRoAh4ppjUl0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bestwhip-67e0b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bestwhip-67e0b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bestwhip-67e0b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "886546495426",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:886546495426:web:f8f87f0938ec2dfec8085b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GEJR9MKLTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
let analytics;
try {
  // Only initialize analytics in production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Analytics not available:', error);
}

// Configure Firestore settings for production
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

// Use initializeFirestore with better settings for production
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  ignoreUndefinedProperties: true
});

export const auth = getAuth(app);
export const storage = getStorage(app);
export { analytics };

// Enable offline persistence
import { enableNetwork, disableNetwork } from "firebase/firestore";

// Function to check Firebase connection
export const checkFirebaseConnection = async () => {
  try {
    await enableNetwork(db);
    console.log('Firebase connected successfully');
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    
    // Provide specific error messages for common issues
    if (error.code === 'permission-denied') {
      console.error('Firestore database not found or permission denied. Please create the Firestore database in Firebase Console.');
    } else if (error.code === 'unavailable') {
      console.error('Firebase service unavailable. Check your internet connection.');
    } else if (error.message.includes('400')) {
      console.error('Bad Request: Firestore database may not be initialized. Please create the database in Firebase Console.');
    }
    
    return false;
  }
};

export default app;