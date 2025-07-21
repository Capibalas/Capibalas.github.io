import { useState } from 'react';
import { productsService } from '../config/dataSource';

const ProductQuickActions = ({ products, onUpdate }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({
    price: '',
    stock: '',
    category: '',
    supplier: ''
  });

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.length === 0) {
      alert('Selecciona al menos un producto');
      return;
    }

    setLoading(true);
    try {
      const updates = {};
      Object.keys(bulkEditData).forEach(key => {
        if (bulkEditData[key] !== '') {
          updates[key] = key === 'price' || key === 'stock' ? parseFloat(bulkEditData[key]) : bulkEditData[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        alert('No hay cambios para aplicar');
        return;
      }

      await Promise.all(
        selectedProducts.map(productId => 
          productsService.updateProduct(productId, { ...updates, updatedAt: new Date() })
        )
      );

      alert(`${selectedProducts.length} productos actualizados exitosamente`);
      setSelectedProducts([]);
      setBulkEditData({ price: '', stock: '', category: '', supplier: '' });
      setSelectedAction('');
      onUpdate();
    } catch (error) {
      console.error('Error updating products:', error);
      alert('Error al actualizar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStockUpdate = async (productId, adjustment) => {
    try {
      const product = products.find(p => p.id === productId);
      const newStock = (product.stock || 0) + adjustment;
      
      await productsService.updateProduct(productId, { 
        stock: newStock, 
        updatedAt: new Date() 
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error al actualizar stock');
    }
  };

  const handleExportLowStock = () => {
    const lowStockProducts = products.filter(p => p.stock <= 5);
    const csv = [
      'Producto,SKU,Stock,Precio,Categoria',
      ...lowStockProducts.map(p => 
        `"${p.title}","${p.sku || ''}",${p.stock || 0},${p.price || 0},"${p.category || ''}"`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos-stock-bajo.csv';
    a.click();
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-slate-800 mb-4">⚡ Acciones Rápidas</h3>
      
      <div className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {products.filter(p => p.stock <= 0).length}
            </p>
            <p className="text-sm text-red-600">Sin Stock</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {products.filter(p => p.stock > 0 && p.stock <= 5).length}
            </p>
            <p className="text-sm text-orange-600">Stock Bajo</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {products.filter(p => p.stock > 5 && p.stock <= 15).length}
            </p>
            <p className="text-sm text-blue-600">Stock Medio</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.stock > 15).length}
            </p>
            <p className="text-sm text-green-600">Stock Alto</p>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="border-t pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={handleSelectAll}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              {selectedProducts.length === products.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
            </button>
            
            <button
              onClick={handleExportLowStock}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
            >
              Exportar Stock Bajo
            </button>
            
            <button
              onClick={() => setSelectedAction(selectedAction === 'bulk-edit' ? '' : 'bulk-edit')}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
            >
              Edición Masiva
            </button>
          </div>

          {selectedAction === 'bulk-edit' && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Editar {selectedProducts.length} productos seleccionados</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio (dejar vacío para no cambiar)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={bulkEditData.price}
                    onChange={(e) => setBulkEditData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Nuevo precio"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Stock (dejar vacío para no cambiar)</label>
                  <input
                    type="number"
                    value={bulkEditData.stock}
                    onChange={(e) => setBulkEditData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Nuevo stock"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría (dejar vacío para no cambiar)</label>
                  <select
                    value={bulkEditData.category}
                    onChange={(e) => setBulkEditData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="">Sin cambios</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Proveedor (dejar vacío para no cambiar)</label>
                  <input
                    type="text"
                    value={bulkEditData.supplier}
                    onChange={(e) => setBulkEditData(prev => ({ ...prev, supplier: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Nuevo proveedor"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedAction('');
                    setBulkEditData({ price: '', stock: '', category: '', supplier: '' });
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBulkUpdate}
                  disabled={loading || selectedProducts.length === 0}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Actualizando...' : 'Aplicar Cambios'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product List with Quick Actions */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Gestión Rápida de Stock</h4>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {products.map(product => {
              const isSelected = selectedProducts.includes(product.id);
              const status = product.stock <= 0 ? 'text-red-600' : 
                           product.stock <= 5 ? 'text-orange-600' : 
                           product.stock <= 15 ? 'text-yellow-600' : 'text-green-600';
              
              return (
                <div 
                  key={product.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg ${isSelected ? 'bg-blue-50 border-blue-300' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-sm">{product.title}</p>
                      <p className="text-xs text-gray-600">SKU: {product.sku || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-sm ${status}`}>{product.stock || 0}</span>
                    
                    <button
                      onClick={() => handleQuickStockUpdate(product.id, -1)}
                      className="w-6 h-6 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
                      title="Reducir 1"
                    >
                      -
                    </button>
                    
                    <button
                      onClick={() => handleQuickStockUpdate(product.id, 1)}
                      className="w-6 h-6 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200"
                      title="Aumentar 1"
                    >
                      +
                    </button>
                    
                    <button
                      onClick={() => handleQuickStockUpdate(product.id, 10)}
                      className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200"
                      title="Aumentar 10"
                    >
                      +10
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickActions;