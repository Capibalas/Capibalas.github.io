import { cacheManager } from '../firebase/cacheManager.js';
import { checkFirebaseConnection } from '../firebase/config.js';
import { productsService, clientsService } from '../firebase/services.js';

// Enhanced Firebase debugging utility
export const debugFirebase = async () => {
  console.log('🔍 Starting Firebase Debug Session...');
  console.log('=====================================');
  
  try {
    // 1. Check cache manager status
    const status = cacheManager.getStatus();
    console.log('📊 Cache Manager Status:', status);
    
    // 2. Test basic connection
    console.log('🔌 Testing basic Firebase connection...');
    const isConnected = await checkFirebaseConnection();
    console.log(`Connection result: ${isConnected ? '✅ Connected' : '❌ Failed'}`);
    
    // 3. Test cache manager initialization
    console.log('🚀 Testing cache manager initialization...');
    try {
      await cacheManager.initializeWithRetry();
      console.log('✅ Cache manager initialized successfully');
    } catch (error) {
      console.error('❌ Cache manager initialization failed:', error.message);
    }
    
    // 4. Test Firestore operations
    console.log('📦 Testing Firestore operations...');
    try {
      const products = await productsService.getProducts();
      console.log(`✅ Products loaded: ${products.length} items`);
      
      const clients = await clientsService.getClients();
      console.log(`✅ Clients loaded: ${clients.length} items`);
    } catch (error) {
      console.error('❌ Firestore operations failed:', error.message);
    }
    
    // 5. Environment info
    console.log('🌍 Environment Information:');
    console.log(`- Hostname: ${window.location.hostname}`);
    console.log(`- Protocol: ${window.location.protocol}`);
    console.log(`- User Agent: ${navigator.userAgent.substring(0, 50)}...`);
    console.log(`- Online: ${navigator.onLine}`);
    
    console.log('=====================================');
    console.log('🎉 Firebase Debug Session Complete');
    
    return {
      cacheManagerStatus: status,
      basicConnection: isConnected,
      environment: {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        online: navigator.onLine
      }
    };
    
  } catch (error) {
    console.error('💥 Debug session failed:', error);
    return { error: error.message };
  }
};

// Quick connection test
export const quickTest = async () => {
  try {
    console.log('⚡ Quick Firebase Test...');
    await cacheManager.initializeWithRetry();
    const products = await productsService.getProducts();
    console.log(`✅ Quick test passed - ${products.length} products found`);
    return true;
  } catch (error) {
    console.error('❌ Quick test failed:', error.message);
    return false;
  }
};

// Reset and retry function
export const resetAndRetry = async () => {
  try {
    console.log('🔄 Resetting Firebase and retrying...');
    cacheManager.reset();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    await cacheManager.initializeWithRetry();
    console.log('✅ Reset and retry successful');
    return true;
  } catch (error) {
    console.error('❌ Reset and retry failed:', error.message);
    return false;
  }
};

// Make functions available globally for browser console
if (typeof window !== 'undefined') {
  window.debugFirebase = debugFirebase;
  window.quickTestFirebase = quickTest;
  window.resetFirebase = resetAndRetry;
  window.cacheManagerStatus = () => cacheManager.getStatus();
}