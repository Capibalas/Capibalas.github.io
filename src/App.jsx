import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ContactForm from './components/ContactForm'
import Hero from './components/Hero'
import Products from './components/Products'
import Features from './components/Features'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import OnboardingDashboard from './components/OnboardingDashboard'
import AdminPanel from './components/AdminPanel'
import ProductCatalog from './pages/ProductCatalog'
import ProductDetail from './pages/ProductDetail'
import Login from './components/Login'
import ClientPortal from './pages/ClientPortal'
import { AuthProvider, useAuth, ProtectedRoute } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
// Import Firebase initialization for production
import './firebase/init.js'
// Import Firebase debug utilities (makes them available in browser console)
import './utils/firebaseDebug.js'
// Import cache error testing utilities
import './utils/testCacheError.js'

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      <Hero />
      <Products />
      <Features />
      <ContactForm />
      <Footer />
    </div>
  )
}

// Navigation Component
const Navigation = () => {
  const { user, isAdmin, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link to="/" className="group flex items-center space-x-2">
              <img
                src="/logo png.png"
                alt="BestWhipMX Logo"
                className="h-12 w-auto"
              />
            </Link>
            <div className="hidden lg:flex space-x-8">
              <Link to="/" className="relative text-slate-700 hover:text-red-600 transition-all duration-300 font-medium group">
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/productos" className="relative text-slate-700 hover:text-red-600 transition-all duration-300 font-medium group">
                Productos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {user && (
                <Link to="/portal" className="relative text-slate-700 hover:text-red-600 transition-all duration-300 font-medium group">
                  Portal B2B
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link to="/dashboard" className="relative text-slate-700 hover:text-red-600 transition-all duration-300 font-medium group">
                    Dashboard Admin
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link to="/admin" className="relative text-slate-700 hover:text-red-600 transition-all duration-300 font-medium group">
                    Admin Panel
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt={user.displayName || 'Usuario'}
                    className="w-10 h-10 rounded-full border-2 border-red-200"
                  />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-900">
                      {user.displayName || 'Usuario'}
                    </p>
                    {isAdmin && (
                      <p className="text-xs text-red-600 font-medium">
                        Administrador
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="border-2 border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
              >
                Acceso B2B
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/productos" element={
              <>
                <Navigation />
                <ProductCatalog />
              </>
            } />
            <Route path="/producto/:productId" element={
              <>
                <Navigation />
                <ProductDetail />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/portal/*" element={
              <ProtectedRoute>
                <Navigation />
                <ClientPortal />
              </ProtectedRoute>
            } />
            <Route path="/setup" element={
              <ProtectedRoute requireAdmin={true}>
                <OnboardingDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute requireAdmin={true}>
                <Navigation />
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <Navigation />
                <AdminPanel />
              </ProtectedRoute>
            } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
