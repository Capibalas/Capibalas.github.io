import React, { useState, useEffect } from 'react';
import { productsService } from '../firebase/services';
import populateProducts from '../utils/populateProductsBrowser';

const AdminProductSeeder = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productsService.getAllProducts();
      setProducts(allProducts);
      setError('');
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error al cargar productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateProducts = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');
      
      const result = await populateProducts();
      
      if (result.success) {
        setMessage(`✅ Productos poblados exitosamente: ${result.created} creados, ${result.skipped} omitidos`);
        await loadProducts(); // Reload products
      } else {
        setError('❌ Error: ' + result.error);
      }
    } catch (err) {
      console.error('Error populating products:', err);
      setError('❌ Error al poblar productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearProducts = async () => {
    if (!window.confirm('¿Estás seguro de eliminar todos los productos?')) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      setError('');
      
      const allProducts = await productsService.getAllProducts();
      let deletedCount = 0;
      
      for (const product of allProducts) {
        if (product.id) {
          await productsService.deleteProduct(product.id);
          deletedCount++;
        }
      }
      
      setMessage(`✅ ${deletedCount} productos eliminados`);
      await loadProducts();
    } catch (err) {
      console.error('Error clearing products:', err);
      setError('❌ Error al eliminar productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Administrador de Productos
        </h2>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={handlePopulateProducts}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Procesando...' : 'Poblar Productos'}
          </button>
          
          <button
            onClick={handleClearProducts}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Procesando...' : 'Limpiar Productos'}
          </button>
          
          <button
            onClick={loadProducts}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Cargando...' : 'Recargar'}
          </button>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Productos actuales: {products.length}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product.stock}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay productos. Haz clic en "Poblar Productos" para agregar productos de muestra.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductSeeder;