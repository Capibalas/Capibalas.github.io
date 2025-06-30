import { useState, useEffect } from 'react';
import { productsService } from '../config/dataSource';
import ImageUpload from './ImageUpload';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    image: '',
    imagePath: '',
    category: 'sifones',
    price: '',
    stock: '',
    minOrder: '1',
    specifications: {},
    features: []
  });

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productsService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Error al cargar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
      const productData = {
        title: newProduct.title,
        description: newProduct.description,
        image: newProduct.image,
        imagePath: newProduct.imagePath,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        minOrder: parseInt(newProduct.minOrder),
        specifications: newProduct.specifications,
        features: newProduct.features.filter(f => f.trim() !== '')
      };

      await productsService.addProduct(productData);
      
      // Reset form
      setNewProduct({
        title: '',
        description: '',
        image: '',
        imagePath: '',
        category: 'sifones',
        price: '',
        stock: '',
        minOrder: '1',
        specifications: {},
        features: []
      });
      
      setShowAddProduct(false);
      await loadProducts();
      alert('Producto agregado exitosamente');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al agregar producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      title: product.title || '',
      description: product.description || '',
      image: product.image || '',
      imagePath: product.imagePath || '',
      category: product.category || 'sifones',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      minOrder: product.minOrder?.toString() || '1',
      specifications: product.specifications || {},
      features: product.features || []
    });
    setShowAddProduct(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setLoading(true);
    
    try {
      const updateData = {
        title: newProduct.title,
        description: newProduct.description,
        image: newProduct.image,
        imagePath: newProduct.imagePath,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        minOrder: parseInt(newProduct.minOrder),
        specifications: newProduct.specifications,
        features: newProduct.features.filter(f => f.trim() !== '')
      };

      await productsService.updateProduct(editingProduct.id, updateData);
      
      // Reset form
      setNewProduct({
        title: '',
        description: '',
        image: '',
        imagePath: '',
        category: 'sifones',
        price: '',
        stock: '',
        minOrder: '1',
        specifications: {},
        features: []
      });
      
      setEditingProduct(null);
      setShowAddProduct(false);
      await loadProducts();
      alert('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }
    
    try {
      await productsService.deleteProduct(productId);
      await loadProducts();
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar producto: ' + error.message);
    }
  };

  const addFeature = () => {
    setNewProduct(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    setNewProduct(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index) => {
    setNewProduct(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const closeModal = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
    setNewProduct({
      title: '',
      description: '',
      image: '',
      imagePath: '',
      category: 'sifones',
      price: '',
      stock: '',
      minOrder: '1',
      specifications: {},
      features: []
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">🛍️ Gestión de Productos</h2>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Products Grid */}
      {loading && !showAddProduct ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl" style={{ display: product.image ? 'none' : 'flex' }}>
                  📦
                </div>
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Precio:</span>
                  <span className="font-semibold">${product.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stock:</span>
                  <span className="font-semibold">{product.stock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Categoría:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.category}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 bg-blue-100 text-blue-800 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 bg-red-100 text-red-800 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Imagen del Producto</label>
                  <ImageUpload
                    onImageUploaded={handleImageUploaded}
                    currentImage={newProduct.image}
                    productId={editingProduct?.id}
                  />
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Producto *</label>
                    <input
                      type="text"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Sifón Profesional 0.5L"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoría *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sifones">Sifones</option>
                      <option value="capsulas">Cápsulas</option>
                      <option value="kits">Kits Completos</option>
                      <option value="accesorios">Accesorios</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción *</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción detallada del producto"
                  />
                </div>

                {/* Pricing and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Precio (MXN) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock *</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Pedido Mínimo *</label>
                    <input
                      type="number"
                      value={newProduct.minOrder}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, minOrder: e.target.value }))}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Características</label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200"
                    >
                      + Agregar
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {newProduct.features.map((feature, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Característica del producto"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Guardar')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;