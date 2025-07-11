import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../firebase/auth';
import { clientsService, productsService } from '../firebase/services';
import { cacheManager } from '../firebase/cacheManager';
import ErrorBoundary from './ErrorBoundary';

const OnboardingDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // New client form
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    costoMXN: '',
    stockInicial: ''
  });

  // Auth state listener
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadData();
        // If user is logged in, move to step 2
        if (currentStep === 1) {
          setCurrentStep(2);
        }
      }
    });

    return () => unsubscribe();
  }, [currentStep]);

  const loadData = async () => {
    try {
      // Ensure Firebase is initialized
      await cacheManager.initializeWithRetry();
      
      const [clientsData, productsData] = await Promise.all([
        clientsService.getClients(),
        productsService.getProducts()
      ]);
      setClients(clientsData || []);
      setProducts(productsData || []);
      
      // Auto-advance steps based on data
      if (clientsData?.length > 0 && currentStep === 2) {
        setCurrentStep(3);
      }
      if (productsData?.length > 0 && currentStep === 3) {
        setCurrentStep(4); // Completed
      }
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message && error.message.includes('cache')) {
        alert('Error de conexión con la base de datos. Por favor, recarga la página.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await authService.signInWithGoogle();
    if (result.success) {
      setCurrentStep(2);
    } else {
      alert('Error al iniciar sesión: ' + result.error);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setCurrentStep(1);
    setClients([]);
    setProducts([]);
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientsService.addClient(newClient);
      setNewClient({ name: '', email: '', phone: '', address: '' });
      setShowAddClient(false);
      await loadData();
      setCurrentStep(3);
    } catch (error) {
      alert('Error al agregar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productsService.addProduct({
        name: newProduct.name,
        costoMXN: parseFloat(newProduct.costoMXN),
        stockInicial: parseInt(newProduct.stockInicial)
      });
      setNewProduct({ name: '', costoMXN: '', stockInicial: '' });
      setShowAddProduct(false);
      await loadData();
      setCurrentStep(4);
    } catch (error) {
      alert('Error al agregar producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      <div className="container mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-emerald-400/20 to-blue-400/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
            <span className="text-emerald-600 font-semibold text-sm">✨ Configuración Inicial</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-6">
            Bienvenido a Best<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600 italic font-light">Whip</span><span className="text-blue-600">MX</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Configura tu sistema empresarial en 3 simples pasos y comienza a gestionar tu negocio de manera profesional
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-6">
            {[
              { number: 1, title: "Autenticación", icon: "🔐" },
              { number: 2, title: "Clientes", icon: "👥" },
              { number: 3, title: "Productos", icon: "📦" }
            ].map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : currentStep === step.number
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {currentStep > step.number ? '✓' : step.icon}
                  </div>
                  <span className={`mt-3 text-sm font-semibold ${
                    currentStep >= step.number ? 'text-emerald-600' :
                    currentStep === step.number ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-20 h-1 mx-4 rounded-full transition-all duration-500 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          
          {/* Step 1: Google Sign In */}
          {currentStep === 1 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center border border-white/50">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">
                  Autenticación Segura
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                  Conecta tu cuenta de Google para acceder de forma segura a tu dashboard empresarial
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 mx-auto"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Conectando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Iniciar Sesión con Google</span>
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Conexión segura y encriptada</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add Clients */}
          {currentStep === 2 && user && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Paso 2: Agregar tus Primeros Clientes
                </h2>
                <p className="text-slate-600 mb-4">
                  Registra los clientes con los que trabajas
                </p>
                <div className="text-sm text-green-600 mb-4">
                  ✓ Sesión iniciada como: {user.displayName}
                </div>
              </div>

              {clients.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700 mb-3">Clientes Registrados:</h3>
                  <div className="space-y-2">
                    {clients.map(client => (
                      <div key={client.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="font-medium text-green-800">{client.name}</div>
                        {client.email && <div className="text-sm text-green-600">{client.email}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => setShowAddClient(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  + Agregar Cliente
                </button>
                
                {clients.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                      Continuar al Paso 3 →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Add Products */}
          {currentStep === 3 && user && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Paso 3: Registrar tus Productos
                </h2>
                <p className="text-slate-600 mb-4">
                  Agrega los productos que vendes con sus costos
                </p>
                <div className="text-sm text-green-600 mb-4">
                  ✓ {clients.length} cliente(s) registrado(s)
                </div>
              </div>

              {products.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700 mb-3">Productos Registrados:</h3>
                  <div className="space-y-2">
                    {products.map(product => (
                      <div key={product.id} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="font-medium text-purple-800">{product.name}</div>
                        <div className="text-sm text-purple-600">
                          Costo: ${product.costoMXN} MXN | Stock: {product.stockInicial}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  + Agregar Producto
                </button>
                
                {products.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                      ¡Completar Configuración! →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Completed */}
          {currentStep === 4 && user && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  ¡Configuración Completada!
                </h2>
                <p className="text-slate-600 mb-6">
                  Tu sistema está listo para usar. Ya puedes comenzar a gestionar tus ventas.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-green-600 font-bold text-2xl">{clients.length}</div>
                    <div className="text-green-700">Cliente(s)</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-purple-600 font-bold text-2xl">{products.length}</div>
                    <div className="text-purple-700">Producto(s)</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-blue-600 font-bold text-2xl">✓</div>
                    <div className="text-blue-700">Listo</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    Ir al Dashboard Completo
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-xl transition-all"
                  >
                    Agregar Más Clientes/Productos
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* User info and sign out */}
        {user && (
          <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <img 
              src={user.photoURL} 
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium">{user.displayName}</span>
            <button
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Salir
            </button>
          </div>
        )}

      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Agregar Nuevo Cliente</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+52 555 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <textarea
                  value={newClient.address}
                  onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Dirección del cliente"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddClient(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-all"
                >
                  {loading ? 'Guardando...' : 'Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ej: Best Whip 8g"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo (MXN) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.costoMXN}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, costoMXN: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial *</label>
                <input
                  type="number"
                  value={newProduct.stockInicial}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, stockInicial: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="100"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddProduct(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-all"
                >
                  {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </ErrorBoundary>
  );
};

export default OnboardingDashboard;