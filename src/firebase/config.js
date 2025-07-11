// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableNetwork, disableNetwork } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirebaseConfig } from "../utils/netlifyConfig";

// Your web app's Firebase configuration
const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
let app;
let db;
let auth;
let storage;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  
  // Initialize Firebase services with proper error handling
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  
  console.log('Firebase services initialized successfully');
  
  // Initialize analytics only in production and when available
  if (typeof window !== 'undefined' &&
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1') &&
      !window.location.hostname.includes('192.168')) {
    try {
      analytics = getAnalytics(app);
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.warn('Analytics not available:', error);
    }
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { db, auth, storage, analytics };

// Function to check Firebase connection with better error handling
export const checkFirebaseConnection = async () => {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    
    // Simple connection test - try to enable network
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
    } else if (error.message && error.message.includes('400')) {
      console.error('Bad Request: Firestore database may not be initialized. Please create the database in Firebase Console.');
    }
    
    return false;
  }
};

export default app;