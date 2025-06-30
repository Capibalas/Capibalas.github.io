// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKh6ifKk0fXQlAy-ixQq-JRoAh4ppjUl0",
  authDomain: "bestwhip-67e0b.firebaseapp.com",
  projectId: "bestwhip-67e0b",
  storageBucket: "bestwhip-67e0b.firebasestorage.app",
  messagingSenderId: "886546495426",
  appId: "1:886546495426:web:f8f87f0938ec2dfec8085b",
  measurementId: "G-GEJR9MKLTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Analytics not available:', error);
}

export const db = getFirestore(app);
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