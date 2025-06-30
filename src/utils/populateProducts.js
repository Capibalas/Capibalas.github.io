import { seedProducts } from './seedProducts.js'

// Script para poblar productos con imágenes reales
const populateProducts = async () => {
  try {
    console.log('🚀 Iniciando población de productos...')
    const result = await seedProducts()
    
    if (result) {
      console.log('✅ Productos poblados exitosamente!')
    } else {
      console.log('❌ Error al poblar productos')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  populateProducts()
}

export default populateProducts