import { useState } from 'react';
import { productsService } from '../config/dataSource';

const sampleProducts = [
  {
    title: "Sifón Profesional 0.5L",
    description: "Sifón de aluminio anodizado con válvula de precisión para resultados perfectos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
    category: "sifones",
    price: 850,
    stock: 25,
    minOrder: 1,
    specifications: {
      capacity: "0.5L",
      material: "Aluminio anodizado",
      weight: "1.2kg",
      warranty: "2 años"
    },
    features: [
      "Válvula de precisión",
      "Diseño ergonómico",
      "Fácil limpieza",
      "Resistente a la corrosión"
    ]
  },
  {
    title: "Sifón Premium 1L",
    description: "Máxima capacidad para uso comercial con acabados de alta calidad",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
    category: "sifones",
    price: 1200,
    stock: 15,
    minOrder: 1,
    specifications: {
      capacity: "1L",
      material: "Acero inoxidable",
      weight: "1.8kg",
      warranty: "3 años"
    },
    features: [
      "Capacidad comercial",
      "Acabado premium",
      "Válvula de alta precisión",
      "Diseño profesional"
    ]
  },
  {
    title: "Cápsulas N2O Premium",
    description: "Cápsulas de óxido nitroso de alta pureza para resultados profesionales",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center",
    category: "capsulas",
    price: 180,
    stock: 500,
    minOrder: 10,
    specifications: {
      purity: "99.9%",
      volume: "8g",
      compatibility: "Universal",
      certification: "ISO 9001"
    },
    features: [
      "Alta pureza",
      "Compatibilidad universal",
      "Certificación ISO",
      "Resultados consistentes"
    ]
  },
  {
    title: "Sifón Mini 0.25L",
    description: "Perfecto para uso doméstico y porciones pequeñas",
    image: "https://images.unsplash.com/photo-1556909114-4f5e4d1e5b4e?w=400&h=400&fit=crop&crop=center",
    category: "sifones",
    price: 550,
    stock: 30,
    minOrder: 1,
    specifications: {
      capacity: "0.25L",
      material: "Aluminio",
      weight: "0.8kg",
      warranty: "1 año"
    },
    features: [
      "Tamaño compacto",
      "Ideal para casa",
      "Fácil manejo",
      "Precio accesible"
    ]
  },
  {
    title: "Kit Completo Profesional",
    description: "Todo lo que necesitas para empezar: sifón + cápsulas + accesorios",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
    category: "kits",
    price: 1400,
    stock: 10,
    minOrder: 1,
    specifications: {
      includes: "Sifón 0.5L + 50 cápsulas + accesorios",
      material: "Aluminio anodizado",
      warranty: "2 años",
      value: "Ahorro del 15%"
    },
    features: [
      "Kit completo",
      "Ahorro significativo",
      "Ideal para iniciar",
      "Incluye accesorios"
    ]
  },
  {
    title: "Dispensador de Crema 500ml",
    description: "Dispensador especializado para cremas y mousses",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
    category: "sifones",
    price: 950,
    stock: 20,
    minOrder: 1,
    specifications: {
      capacity: "500ml",
      material: "Acero inoxidable",
      weight: "1.5kg",
      warranty: "2 años"
    },
    features: [
      "Especializado en cremas",
      "Control de textura",
      "Fácil dispensado",
      "Limpieza sencilla"
    ]
  }
];

const AdminProductSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);

  const checkProducts = async () => {
    try {
      setLoading(true);
      setMessage('Verificando productos...');
      const existingProducts = await productsService.getProducts();
      setProducts(existingProducts);
      setMessage(`Se encontraron ${existingProducts.length} productos en la base de datos`);
    } catch (error) {
      setMessage(`Error al verificar productos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const seedProducts = async () => {
    try {
      setLoading(true);
      setMessage('Poblando productos...');
      
      let added = 0;
      let skipped = 0;

      for (const product of sampleProducts) {
        try {
          await productsService.addProduct(product);
          added++;
          setMessage(`Agregando productos... (${added}/${sampleProducts.length})`);
        } catch (error) {
          console.error(`Error agregando producto:`, error);
          skipped++;
        }
      }

      setMessage(`✅ Completado! ${added} productos agregados, ${skipped} omitidos`);
      
      // Verificar productos después de agregarlos
      setTimeout(() => {
        checkProducts();
      }, 1000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllProducts = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar TODOS los productos?')) {
      return;
    }

    try {
      setLoading(true);
      setMessage('Eliminando productos...');
      
      const existingProducts = await productsService.getProducts();
      let deleted = 0;

      for (const product of existingProducts) {
        try {
          await productsService.deleteProduct(product.id);
          deleted++;
          setMessage(`Eliminando productos... (${deleted}/${existingProducts.length})`);
        } catch (error) {
          console.error(`Error eliminando producto:`, error);
        }
      }

      setMessage(`✅ ${deleted} productos eliminados`);
      setProducts([]);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🔧 Gestión de Productos
        </h2>

        <div className="space-y-4 mb-6">
          <button
            onClick={checkProducts}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? '⏳ Verificando...' : '🔍 Verificar Productos Existentes'}
          </button>

          <button
            onClick={seedProducts}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? '⏳ Procesando...' : '➕ Poblar Productos de Ejemplo'}
          </button>

          <button
            onClick={deleteAllProducts}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? '⏳ Eliminando...' : '🗑️ Eliminar TODOS los Productos'}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-4 ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 
            message.includes('❌') ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            <p className="font-medium">{message}</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Productos Actuales ({products.length}):
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{product.title}</h4>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <div className="flex gap-3 mt-2 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {product.category}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          ${product.price}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded ml-3"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">ℹ️ Información</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Este panel te permite gestionar rápidamente los productos de prueba</li>
            <li>• Los productos se agregarán a Firebase Firestore</li>
            <li>• Puedes verificar cuántos productos existen actualmente</li>
            <li>• La función de eliminar borrará TODOS los productos (úsala con cuidado)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminProductSeeder;