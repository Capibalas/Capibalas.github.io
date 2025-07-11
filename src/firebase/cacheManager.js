import { db } from './config.js';
import { enableNetwork, disableNetwork, clearIndexedDbPersistence, waitForPendingWrites } from 'firebase/firestore';

class FirebaseCacheManager {
  constructor() {
    this.isInitialized = false;
    this.initializationPromise = null;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async clearCache() {
    try {
      console.log('🧹 Clearing Firebase cache...');
      
      // Disable network first
      await disableNetwork(db);
      console.log('📴 Network disabled');
      
      // Wait for pending writes
      await waitForPendingWrites(db);
      console.log('⏳ Waited for pending writes');
      
      // Clear IndexedDB persistence
      await clearIndexedDbPersistence(db);
      console.log('🗑️ Cleared IndexedDB persistence');
      
      // Re-enable network
      await enableNetwork(db);
      console.log('📶 Network re-enabled');
      
      return true;
    } catch (error) {
      console.warn('Cache clear failed (this is often normal):', error.message);
      
      // Try to at least re-enable network
      try {
        await enableNetwork(db);
      } catch (enableError) {
        console.warn('Could not re-enable network:', enableError.message);
      }
      
      return false;
    }
  }

  async initializeWithRetry() {
    if (this.isInitialized) {
      return true;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  async _performInitialization() {
    while (this.retryCount < this.maxRetries) {
      try {
        console.log(`🔄 Firebase initialization attempt ${this.retryCount + 1}/${this.maxRetries}`);
        
        // Clear cache on first attempt or if previous attempts failed
        if (this.retryCount > 0) {
          await this.clearCache();
        }
        
        // Test connection
        await enableNetwork(db);
        console.log('✅ Firebase connection successful');
        
        this.isInitialized = true;
        this.retryCount = 0;
        return true;
        
      } catch (error) {
        this.retryCount++;
        console.error(`❌ Firebase initialization attempt ${this.retryCount} failed:`, error.message);
        
        if (this.retryCount >= this.maxRetries) {
          console.error('🚨 All Firebase initialization attempts failed');
          this.initializationPromise = null;
          
          // Generate the exact error message from the screenshot
          throw new Error('Database cache issue, please refresh the page');
        }
        
        // Wait before retry with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 5000);
        console.log(`⏱️ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  reset() {
    this.isInitialized = false;
    this.initializationPromise = null;
    this.retryCount = 0;
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      retryCount: this.retryCount,
      isRetrying: this.initializationPromise !== null && !this.isInitialized
    };
  }
}

// Export singleton instance
export const cacheManager = new FirebaseCacheManager();

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