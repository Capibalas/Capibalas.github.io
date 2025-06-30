// Test script to verify Firebase connection
import { checkFirebaseConnection } from '../firebase/config';
import { productsService } from '../firebase/services';

export const testFirebaseConnection = async () => {
  console.log('🔥 Testing Firebase connection...');
  
  try {
    // Test basic connection
    const isConnected = await checkFirebaseConnection();
    
    if (!isConnected) {
      console.error('❌ Firebase connection failed');
      return false;
    }
    
    console.log('✅ Firebase connection successful');
    
    // Test Firestore operations
    console.log('📊 Testing Firestore operations...');
    
    try {
      // Try to read from products collection
      const products = await productsService.getProducts();
      console.log('✅ Firestore read operation successful');
      console.log(`📦 Found ${products.length} products`);
      
      return true;
    } catch (firestoreError) {
      console.error('❌ Firestore operation failed:', firestoreError.message);
      
      if (firestoreError.message.includes('permission-denied')) {
        console.log('💡 Solution: Check Firestore security rules');
      } else if (firestoreError.message.includes('not-found')) {
        console.log('💡 Solution: Create the Firestore database in Firebase Console');
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return false;
  }
};

// Function to run the test from browser console
window.testFirebase = testFirebaseConnection;