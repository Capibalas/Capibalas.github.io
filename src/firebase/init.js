// Firebase initialization for production - now using cache manager
import { cacheManager } from './cacheManager.js';

// Legacy exports for backward compatibility
export const initializeFirebaseForProduction = async () => {
  return cacheManager.initializeWithRetry();
};

export const isFirebaseReady = () => {
  return cacheManager.getStatus().isInitialized;
};

export const resetFirebaseInitialization = () => {
  cacheManager.reset();
};

// Auto-initialize when in production
if (typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1') {
  
  // Initialize with a delay to avoid blocking the main thread
  setTimeout(() => {
    cacheManager.initializeWithRetry().catch(error => {
      console.error('Auto-initialization failed:', error);
    });
  }, 100);
}