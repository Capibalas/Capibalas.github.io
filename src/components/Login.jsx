import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import FirebaseTest from './FirebaseTest'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const { login, user, isAdmin, loginAsDev, loginAsDevAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/dashboard')
      } else {
        // Usuario autenticado pero no admin, mostrar mensaje
        setError('Tu cuenta no tiene permisos de administrador para acceder al portal B2B.')
      }
    }
  }, [user, isAdmin, navigate])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      console.log('Iniciando login con Google...')
      const result = await login()
      
      if (result.success) {
        console.log('Login exitoso:', result.user.email)
        // La redirección se maneja en el useEffect de arriba
      } else {
        console.error('Error en login:', result.error)
        setError(result.error || 'Error al iniciar sesión con Google')
      }
    } catch (error) {
      console.error('Error en handleGoogleLogin:', error)
      setError('Error al conectar con Google. Verifica tu conexión e inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDevAccess = () => {
    // Simular usuario de desarrollo
    const result = loginAsDev()
    if (result.success) {
      navigate('/portal')
    }
  }

  const handleDevAdminAccess = () => {
    // Simular usuario administrador de desarrollo
    const result = loginAsDevAdmin()
    if (result.success) {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/whipped.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <img 
              src="/logo png.png" 
              alt="BestWhipMX Logo" 
              className="h-12 w-auto"
            />
          </Link>
          <Link 
            to="/" 
            className={`text-white/90 hover:text-red-300 transition-all duration-300 font-medium ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
          >
            ← Volver al inicio
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className={`bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
              🔐
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Acceso B2B
            </h1>
            <p className="text-slate-600">
              Inicia sesión para acceder al portal empresarial
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-red-300 text-gray-700 hover:text-red-600 py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Conectando con Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continuar con Google</span>
              </>
            )}
          </button>

          {/* Botones de acceso de desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="space-y-3 mt-4">
              <button
                onClick={handleDevAccess}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
              >
                🚀 Acceso de Desarrollo (Portal Cliente)
              </button>
              <button
                onClick={handleDevAdminAccess}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
              >
                🔧 Acceso de Desarrollo (Admin)
              </button>
            </div>
          )}

          {/* Debug Info (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs">
              <p className="text-gray-600 mb-1">Debug Info:</p>
              <p className="text-gray-500">User: {user ? user.email : 'No autenticado'}</p>
              <p className="text-gray-500">Admin: {isAdmin ? 'Sí' : 'No'}</p>
              <p className="text-gray-500">Loading: {isLoading ? 'Sí' : 'No'}</p>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-lg">ℹ️</div>
              <div>
                <p className="text-blue-800 text-sm font-medium mb-1">
                  Acceso Restringido
                </p>
                <p className="text-blue-700 text-xs">
                  Solo administradores autorizados pueden acceder al portal B2B. 
                  Si no tienes permisos, contacta al administrador del sistema.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              ¿Problemas para acceder?{' '}
              <Link to="/#contacto" className="text-red-600 hover:text-red-700 font-medium">
                Contacta soporte
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Componente de prueba Firebase (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && <FirebaseTest />}
    </div>
  )
}

export default Login