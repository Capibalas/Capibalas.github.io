// Test utility to simulate the cache error from the screenshot
import { cacheManager } from '../firebase/cacheManager.js';

// Function to simulate the exact error scenario
export const simulateCacheError = () => {
  console.log('🧪 Simulating cache error scenario...');
  
  // Reset cache manager to force reinitialization
  cacheManager.reset();
  
  // Override the initialization to always fail
  const originalInit = cacheManager.initializeWithRetry;
  cacheManager.initializeWithRetry = async () => {
    throw new Error('Database cache issue, please refresh the page');
  };
  
  console.log('❌ Cache error simulation activated');
  console.log('💡 The dashboard should now show the error from the screenshot');
  
  // Return function to restore normal behavior
  return () => {
    cacheManager.initializeWithRetry = originalInit;
    console.log('✅ Cache error simulation deactivated');
  };
};

// Function to test the error recovery
export const testErrorRecovery = async () => {
  console.log('🔄 Testing error recovery...');
  
  try {
    // Reset and try to recover
    cacheManager.reset();
    await cacheManager.initializeWithRetry();
    console.log('✅ Error recovery successful');
    return true;
  } catch (error) {
    console.error('❌ Error recovery failed:', error.message);
    return false;
  }
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.simulateCacheError = simulateCacheError;
  window.testErrorRecovery = testErrorRecovery;
  
  console.log('🧪 Cache error testing utilities loaded:');
  console.log('- window.simulateCacheError() - Simulate the error from screenshot');
  console.log('- window.testErrorRecovery() - Test error recovery');
}