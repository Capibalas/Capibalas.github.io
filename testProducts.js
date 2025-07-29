// Test script to check products loading
import { productsService } from './src/firebase/services.js';

async function testProducts() {
  try {
    console.log('Testing products loading...');
    const products = await productsService.getProducts();
    console.log('✅ Products loaded successfully!');
    console.log(`Found ${products.length} products`);
    
    if (products.length > 0) {
      console.log('Sample products:', products.slice(0, 2));
    } else {
      console.log('⚠️ No products found in database');
    }
    
    return products;
  } catch (error) {
    console.error('❌ Error loading products:', error);
    throw error;
  }
}

// Run the test
testProducts()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Test failed:', err));