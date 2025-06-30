// Production-specific Firebase configuration
import { getFirestore, enableNetwork, disableNetwork, clearIndexedDbPersistence } from "firebase/firestore";

// Function to initialize Firestore for production with error recovery
export const initializeProductionFirestore = async (app) => {
  try {
    // Clear any existing persistence to avoid conflicts
    try {
      await clearIndexedDbPersistence(getFirestore(app));
    } catch (clearError) {
      console.warn('Could not clear persistence:', clearError);
    }

    const db = getFirestore(app);
    
    // Enable network with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await enableNetwork(db);
        console.log('Firestore network enabled successfully');
        break;
      } catch (error) {
        console.warn(`Network enable attempt failed, retries left: ${retries - 1}`, error);
        retries--;
        if (retries === 0) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return db;
  } catch (error) {
    console.error('Failed to initialize production Firestore:', error);
    throw error;
  }
};

// Function to handle Firestore errors in production
export const handleProductionFirestoreError = (error, operation) => {
  console.error(`Production Firestore ${operation} error:`, error);
  
  // Handle specific production errors
  if (error.code === 'failed-precondition') {
    console.error('Firestore failed precondition - this usually means the database is not properly initialized');
    return { success: false, error: 'Database not properly initialized' };
  }
  
  if (error.code === 'internal') {
    console.error('Firestore internal error - this is usually a temporary issue');
    return { success: false, error: 'Temporary database issue, please try again' };
  }
  
  if (error.message && error.message.includes('INTERNAL ASSERTION FAILED')) {
    console.error('Firestore internal assertion failed - clearing cache and retrying');
    return { success: false, error: 'Database cache issue, please refresh the page' };
  }
  
  return { success: false, error: error.message || 'Unknown database error' };
};