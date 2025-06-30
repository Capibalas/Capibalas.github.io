import { useState } from 'react';
import { productsService, clientsService, pricingService } from '../config/dataSource';
import ImageUpload from './ImageUpload';

const ProductConfig = ({ products, clients, pricing, onDataUpdate }) => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    image: '',
    imagePath: '',
    category: 'sifones',
    price: '',
    stock: '',
    minOrder: '1'
  });
  const [newClient, setNewClient] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleImageUploaded = (imageResult) => {
    if (imageResult) {
      setNewProduct(prev => ({
        ...prev,
        image: imageResult.url,
        imagePath: imageResult.path
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        image: '',
        imagePath: ''
      }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productsService.addProduct({
        title: newProduct.title,
        description: newProduct.description,
        image: newProduct.image,
        imagePath: newProduct.imagePath,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        minOrder: parseInt(newProduct.minOrder),
        specifications: {},
        features: []
      });
      setNewProduct({
        title: '',
        description: '',
        image: '',
        imagePath: '',
        category: 'sifones',
        price: '',
        stock: '',
        minOrder: '1'
      });
      setShowAddProduct(false);
      onDataUpdate();
    } catch (error) {
      alert('Error al agregar producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientsService.addClient({
        name: newClient.name
      });
      setNewClient({ name: '' });
      setShowAddClient(false);
      onDataUpdate();
    } catch (error) {
      alert('Error al agregar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async (clientId, productId, price) => {
    try {
      await pricingService.setPricing(clientId, productId, parseFloat(price) || 0);
      onDataUpdate();
    } catch (error) {
      alert('Error al actualizar precio: ' + error.message);
    }
  };

  const handleProductUpdate = async (productId, field, value) => {
    try {
      // Validate that productId exists
      if (!productId) {
        throw new Error('ID de producto no válido');
      }

      const updateData = {};
      if (field === 'price' || field === 'costoMXN') {
        // Update both price and costoMXN for compatibility
        updateData.price = parseFloat(value) || 0;
        updateData.costoMXN = parseFloat(value) || 0;
      } else if (field === 'stock' || field === 'stockInicial') {
        // Update both stock and stockInicial for compatibility
        updateData.stock = parseInt(value) || 0;
        updateData.stockInicial = parseInt(value) || 0;
      } else if (field === 'minOrder') {
        updateData.minOrder = parseInt(value) || 1;
      }
      
      // Add updatedAt timestamp
      updateData.updatedAt = new Date();
      
      console.log('Updating product:', productId, 'with data:', updateData);
      await productsService.updateProduct(productId, updateData);
      onDataUpdate();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar producto: ' + error.message);
    }
  };

  return (
    <details className="bg-white rounded-xl p-6 shadow-lg">
      <summary className="font-bold text-xl text-slate-800 cursor-pointer">⚙️ Configuración de Productos y Clientes</summary>
      <div className="mt-6">
        
        {/* Products Section */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Productos y Costos</h3>
          <button 
            onClick={() => setShowAddProduct(true)}
            className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md hover:bg-blue-200"
          >
            + Nuevo Producto
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-2 py-2">Producto</th>
                <th className="px-2 py-2">Categoría</th>
                <th className="px-2 py-2">Precio (MXN)</th>
                <th className="px-2 py-2">Stock</th>
                <th className="px-2 py-2">Min. Pedido</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-2 py-1">
                    <div className="flex items-center space-x-2">
                      {product.image && product.image.startsWith('http') ? (
                        <img
                          src={product.image}
                          alt={product.title || product.name}
                          className="w-8 h-8 object-cover rounded"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center text-xs">
                          {product.image || '📦'}
                        </div>
                      )}
                      <span className="text-sm">{product.title || product.name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-1">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {product.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={product.price || product.costoMXN}
                      onBlur={(e) => handleProductUpdate(product.id, 'price', e.target.value)}
                      className="w-full bg-blue-50 border-slate-300 rounded text-center text-sm"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      defaultValue={product.stock || product.stockInicial}
                      onBlur={(e) => handleProductUpdate(product.id, 'stock', e.target.value)}
                      className="w-full bg-blue-50 border-slate-300 rounded text-center text-sm"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      defaultValue={product.minOrder || 1}
                      onBlur={(e) => handleProductUpdate(product.id, 'minOrder', e.target.value)}
                      className="w-full bg-blue-50 border-slate-300 rounded text-center text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clients and Pricing Section */}
        <div className="flex justify-between items-center mb-2 mt-6">
          <h3 className="font-semibold">Clientes y Precios de Venta (MXN)</h3>
          <button 
            onClick={() => setShowAddClient(true)}
            className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md hover:bg-blue-200"
          >
            + Nuevo Cliente
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-2 py-2">Cliente</th>
                {products.map(product => (
                  <th key={product.id} className="px-2 py-2">{product.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td className="px-2 py-1 font-semibold">{client.name}</td>
                  {products.map(product => (
                    <td key={product.id} className="px-2 py-1">
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={(pricing[client.id] || {})[product.id] || 0}
                        onBlur={(e) => handlePriceUpdate(client.id, product.id, e.target.value)}
                        className="w-full bg-blue-50 border-slate-300 rounded text-center"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Añadir Nuevo Producto</h3>
            <form onSubmit={handleAddProduct} className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium">Nombre del Producto</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="mt-1 w-full border-slate-300 rounded-md px-3 py-2"
                  placeholder="Ej: Sifón Profesional 0.5L"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Descripción</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  required
                  className="mt-1 w-full border-slate-300 rounded-md px-3 py-2"
                  rows="2"
                  placeholder="Descripción del producto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Imagen del Producto</label>
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  currentImage={newProduct.image}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Categoría</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="mt-1 w-full border-slate-300 rounded-md px-3 py-2"
                >
                  <option value="sifones">Sifones</option>
                  <option value="capsulas">Cápsulas</option>
                  <option value="kits">Kits Completos</option>
                  <option value="accesorios">Accesorios</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Precio (MXN)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    required
                    className="mt-1 w-full border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    required
                    className="mt-1 w-full border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Pedido Mínimo</label>
                <input
                  type="number"
                  value={newProduct.minOrder}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, minOrder: e.target.value }))}
                  required
                  className="mt-1 w-full border-slate-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddProduct(false)}
                  className="bg-slate-200 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Añadir Nuevo Cliente</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre del Cliente</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="mt-1 w-full border-slate-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddClient(false)}
                  className="bg-slate-200 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </details>
  );
};

export default ProductConfig;