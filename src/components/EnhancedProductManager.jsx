import { useState, useEffect, useMemo } from 'react';
import { productsService } from '../config/dataSource';
import ImageUpload from './ImageUpload';

const EnhancedProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  
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
    features: [],
    sku: '',
    barcode: '',
    cost: '',
    supplier: '',
    tags: []
  });

  const categories = ['all', 'sifones', 'capsulas', 'kits', 'accesorios', 'recambios', 'mantenimiento'];
  
  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Sort products
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'price' || sortBy === 'stock' || sortBy === 'cost') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

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
        price: parseFloat(newProduct.price) || 0,
        stock: parseInt(newProduct.stock) || 0,
        minOrder: parseInt(newProduct.minOrder) || 1,
        specifications: newProduct.specifications,
        features: newProduct.features.filter(f => f.trim() !== ''),
        sku: newProduct.sku,
        barcode: newProduct.barcode,
        cost: parseFloat(newProduct.cost) || 0,
        supplier: newProduct.supplier,
        tags: newProduct.tags.filter(t => t.trim() !== ''),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await productsService.addProduct(productData);
      
      resetForm();
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
      features: product.features || [],
      sku: product.sku || '',
      barcode: product.barcode || '',
      cost: product.cost?.toString() || '',
      supplier: product.supplier || '',
      tags: product.tags || []
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
        price: parseFloat(newProduct.price) || 0,
        stock: parseInt(newProduct.stock) || 0,
        minOrder: parseInt(newProduct.minOrder) || 1,
        specifications: newProduct.specifications,
        features: newProduct.features.filter(f => f.trim() !== ''),
        sku: newProduct.sku,
        barcode: newProduct.barcode,
        cost: parseFloat(newProduct.cost) || 0,
        supplier: newProduct.supplier,
        tags: newProduct.tags.filter(t => t.trim() !== ''),
        updatedAt: new Date()
      };

      await productsService.updateProduct(editingProduct.id, updateData);
      
      resetForm();
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

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert('Selecciona al menos un producto');
      return;
    }
    
    if (!confirm(`¿Eliminar ${selectedProducts.length} productos?`)) {
      return;
    }
    
    try {
      setLoading(true);
      await Promise.all(selectedProducts.map(id => productsService.deleteProduct(id)));
      setSelectedProducts([]);
      await loadProducts();
      alert('Productos eliminados exitosamente');
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Error al eliminar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportProducts = () => {
    const exportData = products.map(product => ({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minOrder: product.minOrder,
      sku: product.sku,
      barcode: product.barcode,
      cost: product.cost,
      supplier: product.supplier,
      tags: product.tags?.join(', ')
    }));
    
    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos.csv';
    a.click();
  };

  const handleImportProducts = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
        const product = {};
        headers.forEach((header, index) => {
          product[header] = values[index];
        });
        
        try {
          await productsService.addProduct({
            ...product,
            price: parseFloat(product.price) || 0,
            stock: parseInt(product.stock) || 0,
            minOrder: parseInt(product.minOrder) || 1,
            cost: parseFloat(product.cost) || 0,
            tags: product.tags ? product.tags.split(',').map(t => t.trim()) : []
          });
        } catch (error) {
          console.error('Error importing product:', error);
        }
      }
      
      await loadProducts();
      alert('Productos importados exitosamente');
    };
    reader.readAsText(file);
  };

  const resetForm = () => {
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
      features: [],
      sku: '',
      barcode: '',
      cost: '',
      supplier: '',
      tags: []
    });
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

  const addTag = () => {
    setNewProduct(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const updateTag = (index, value) => {
    setNewProduct(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const removeTag = (index) => {
    setNewProduct(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const stockStatus = (stock) => {
    if (stock <= 0) return { label: 'Sin stock', color: 'text-red-600 bg-red-100' };
    if (stock <= 5) return { label: 'Crítico', color: 'text-orange-600 bg-orange-100' };
    if (stock <= 15) return { label: 'Bajo', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Normal', color: 'text-green-600 bg-green-100' };
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">🛍️ Gestión Avanzada de Productos</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImportExport(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
          >
            Importar/Exportar
          </button>
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            + Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="title">Nombre</option>
            <option value="price">Precio</option>
            <option value="stock">Stock</option>
            <option value="category">Categoría</option>
            <option value="updatedAt">Última actualización</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium">{selectedProducts.length} productos seleccionados</span>
            <button
              onClick={handleBulkDelete}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Eliminar seleccionados
            </button>
            <button
              onClick={() => setSelectedProducts([])}
              className="text-sm bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            >
              Limpiar selección
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading && !showAddProduct ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const status = stockStatus(product.stock);
            return (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
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
                  
                  {/* Stock Status Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${status.color}`}>
                    {status.label}
                  </div>
                  
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="absolute top-2 left-2 w-4 h-4"
                  />
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
                    <span className="text-gray-500">SKU:</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.sku || 'N/A'}</span>
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
            );
          })}
        </div>
      )}

      {/* Import/Export Modal */}
      {showImportExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">Importar/Exportar Productos</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Exportar Productos</h4>
                  <button
                    onClick={handleExportProducts}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  >
                    Descargar CSV
                  </button>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Importar Productos</h4>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportProducts}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Formato: nombre, descripción, categoría, precio, stock, sku, costo
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowImportExport(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Imagen del Producto</label>
                      <ImageUpload
                        onImageUploaded={handleImageUploaded}
                        currentImage={newProduct.image}
                        productId={editingProduct?.id}
                      />
                    </div>

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
                      <label className="block text-sm font-medium mb-1">SKU</label>
                      <input
                        type="text"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Código único del producto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Código de Barras</label>
                      <input
                        type="text"
                        value={newProduct.barcode}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, barcode: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234567890123"
                      />
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Categoría *</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.filter(c => c !== 'all').map(cat => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium mb-1">Costo (MXN)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newProduct.cost}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, cost: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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

                    <div>
                      <label className="block text-sm font-medium mb-1">Proveedor</label>
                      <input
                        type="text"
                        value={newProduct.supplier}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, supplier: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre del proveedor"
                      />
                    </div>
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

                {/* Tags */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Etiquetas</label>
                    <button
                      type="button"
                      onClick={addTag}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200"
                    >
                      + Agregar
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {newProduct.tags.map((tag, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => updateTag(index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Etiqueta"
                        />
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
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
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
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

export default EnhancedProductManager;