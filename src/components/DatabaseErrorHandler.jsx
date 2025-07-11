import { useState } from 'react';
import { cacheManager } from '../firebase/cacheManager';

const DatabaseErrorHandler = ({ error, onRetry, children }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Reset cache manager
      cacheManager.reset();
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to reinitialize
      await cacheManager.initializeWithRetry();
      
      // Call the parent retry function
      if (onRetry) {
        await onRetry();
      }
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      // Force page reload as last resort
      window.location.reload();
    } finally {
      setIsRetrying(false);
    }
  };

  // If there's a database cache error, show the exact error UI from the screenshot
  if (error && error.includes('Database cache issue')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/50">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">
                Error initializing data: Database cache issue, please refresh the page
              </h2>
            </div>
            
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 mx-auto"
            >
              {isRetrying ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Reintentando...</span>
                </>
              ) : (
                <span>Reintentar</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no error, render children
  return children;
};

export default DatabaseErrorHandler;