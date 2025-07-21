import { useState, useEffect, useMemo } from 'react';
import { productsService } from '../config/dataSource';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const PublicProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productsService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const handleProductClick = (product) => {
    if (user) {
      // Usuario registrado puede ver detalles completos
      setSelectedProduct(product);
    } else {
      // Usuario no registrado - mostrar modal de registro
      setShowAuthModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
          <p className="text-lg text-gray-600">
            {user 
              ? 'Bienvenido! Puedes ver precios y hacer pedidos.' 
              : 'Regístrate para ver precios y hacer pedidos'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
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
                  {cat === 'all' ? 'Todas las categorías' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image */}
              <div className="w-full h-48 bg-gray-100 relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                    📦
                  </div>
                )}
                
                {/* Stock Badge */}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                    ¡Últimas unidades!
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Agotado
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Categoría:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.category}</span>
                  </div>
                  
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Características:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {product.features.slice(0, 2).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                        {product.features.length > 2 && (
                          <li className="text-blue-600">+{product.features.length - 2} más</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Price and Stock - Only for registered users */}
                {user ? (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                      <span className="text-sm text-gray-600">
                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                    <button className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Agregar al Carrito
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t">
                    <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors">
                      Ver Precios - Regístrate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            // El usuario se registró exitosamente
            setSelectedProduct(null);
          }}
        />

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{selectedProduct.title}</h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div>
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-6xl rounded-lg">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold">Categoría:</span>
                        <span className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">{selectedProduct.category}</span>
                      </div>

                      {selectedProduct.features && selectedProduct.features.length > 0 && (
                        <div>
                          <span className="font-semibold">Características:</span>
                          <ul className="mt-2 space-y-1">
                            {selectedProduct.features.map((feature, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                        <div>
                          <span className="font-semibold">Etiquetas:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedProduct.tags.map((tag, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {user && (
                        <>
                          <div>
                            <span className="font-semibold">Precio:</span>
                            <span className="ml-2 text-2xl font-bold text-blue-600">${selectedProduct.price}</span>
                          </div>
                          
                          <div>
                            <span className="font-semibold">Stock:</span>
                            <span className={`ml-2 ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedProduct.stock > 0 ? `${selectedProduct.stock} disponibles` : 'Agotado'}
                            </span>
                          </div>

                          {selectedProduct.stock > 0 && (
                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                              Agregar al Carrito
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {!user && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 mb-3">
                          Regístrate para ver precios y hacer pedidos
                        </p>
                        <button
                          onClick={() => {
                            setSelectedProduct(null);
                            setShowAuthModal(true);
                          }}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Registrarse ahora
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProductCatalog;