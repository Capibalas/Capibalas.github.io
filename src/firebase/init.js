// Firebase initialization for production
import { db } from './config.js';
import { enableNetwork, disableNetwork, waitForPendingWrites, clearIndexedDbPersistence } from 'firebase/firestore';

let isInitialized = false;
let initializationPromise = null;

// Initialize Firebase for production with proper error handling
export const initializeFirebaseForProduction = async () => {
  if (isInitialized) {
    return true;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('Initializing Firebase for production...');

      // Clear any existing persistence issues
      try {
        await clearIndexedDbPersistence(db);
        console.log('Cleared existing persistence');
      } catch (clearError) {
        console.warn('Could not clear persistence (this is normal):', clearError.message);
      }

      // Wait for any pending writes
      try {
        await waitForPendingWrites(db);
        console.log('Waited for pending writes');
      } catch (waitError) {
        console.warn('Could not wait for pending writes:', waitError.message);
      }

      // Enable network with retry logic
      let retries = 3;
      let lastError;
      
      while (retries > 0) {
        try {
          await enableNetwork(db);
          console.log('Firebase network enabled successfully');
          isInitialized = true;
          return true;
        } catch (error) {
          lastError = error;
          console.warn(`Network enable attempt failed, retries left: ${retries - 1}`, error.message);
          retries--;
          
          if (retries > 0) {
            // Wait before retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
          }
        }
      }

      throw lastError;
    } catch (error) {
      console.error('Failed to initialize Firebase for production:', error);
      initializationPromise = null; // Reset so we can try again
      throw error;
    }
  })();

  return initializationPromise;
};

// Function to check if Firebase is properly initialized
export const isFirebaseReady = () => {
  return isInitialized;
};

// Function to reset initialization (for error recovery)
export const resetFirebaseInitialization = () => {
  isInitialized = false;
  initializationPromise = null;
};

// Auto-initialize when in production
if (typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1') {
  
  // Initialize with a delay to avoid blocking the main thread
  setTimeout(() => {
    initializeFirebaseForProduction().catch(error => {
      console.error('Auto-initialization failed:', error);
    });
  }, 100);
}