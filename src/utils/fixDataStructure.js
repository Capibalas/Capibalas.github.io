import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

// Function to fix existing products with inconsistent field structure
export const fixProductDataStructure = async () => {
  try {
    console.log('Starting product data structure fix...');
    
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${products.length} products to check`);
    
    for (const product of products) {
      const updates = {};
      let needsUpdate = false;
      
      // Fix title field
      if (product.name && !product.title) {
        updates.title = product.name;
        needsUpdate = true;
      }
      
      // Fix price field
      if (product.costoMXN && !product.price) {
        updates.price = product.costoMXN;
        needsUpdate = true;
      }
      
      // Fix stock field
      if (product.stockInicial && !product.stock) {
        updates.stock = product.stockInicial;
        needsUpdate = true;
      }
      
      // Add missing fields with defaults
      if (!product.minOrder) {
        updates.minOrder = 1;
        needsUpdate = true;
      }
      
      if (!product.category) {
        updates.category = 'sifones'; // default category
        needsUpdate = true;
      }
      
      if (!product.description) {
        updates.description = product.title || product.name || 'Producto sin descripción';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        updates.updatedAt = new Date();
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, updates);
        console.log(`Updated product: ${product.name || product.title} with fields:`, Object.keys(updates));
      }
    }
    
    console.log('Product data structure fix completed!');
    return true;
  } catch (error) {
    console.error('Error fixing product data structure:', error);
    throw error;
  }
};

// Export for use in console
if (typeof window !== 'undefined') {
  window.fixProductDataStructure = fixProductDataStructure;
}