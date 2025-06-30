import { seedProducts } from './seedProducts.js';

// Function to populate products with real data
export const populateRealProducts = async () => {
  try {
    console.log('🚀 Iniciando población de productos con datos reales...');
    
    const success = await seedProducts();
    
    if (success) {
      console.log('✅ Productos poblados exitosamente con datos reales');
      return true;
    } else {
      console.log('❌ Error al poblar productos');
      return false;
    }
  } catch (error) {
    console.error('❌ Error en población de productos:', error);
    return false;
  }
};

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateRealProducts();
}

export default populateRealProducts;