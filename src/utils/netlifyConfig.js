// Netlify-specific configuration for Firebase
export const isNetlifyProduction = () => {
  return typeof window !== 'undefined' && 
         (window.location.hostname.includes('netlify.app') || 
          window.location.hostname.includes('bestwhip.com.mx'));
};

export const getFirebaseConfig = () => {
  // Handle both Node.js and browser environments
  const isNode = typeof process !== 'undefined' && process.env;
  
  if (isNode) {
    // Node.js environment - use process.env
    return {
      apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCKh6ifKk0fXQlAy-ixQq-JRoAh4ppjUl0",
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "bestwhip-67e0b.firebaseapp.com",
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || "bestwhip-67e0b",
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "bestwhip-67e0b.firebasestorage.app",
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "886546495426",
      appId: process.env.VITE_FIREBASE_APP_ID || "1:886546495426:web:f8f87f0938ec2dfec8085b",
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GEJR9MKLTL"
    };
  } else {
    // Browser environment - use import.meta.env (Vite)
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKh6ifKk0fXQlAy-ixQq-JRoAh4ppjUl0",
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bestwhip-67e0b.firebaseapp.com",
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bestwhip-67e0b",
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bestwhip-67e0b.firebasestorage.app",
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "886546495426",
      appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:886546495426:web:f8f87f0938ec2dfec8085b",
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GEJR9MKLTL"
    };
  }
};

// Handle Firebase initialization errors gracefully
export const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  
  // Common Firebase errors and their solutions
  const errorMessages = {
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
    'firestore/permission-denied': 'Permisos insuficientes. Contacta al administrador.',
    'firestore/unavailable': 'Servicio no disponible. Intenta más tarde.',
    'auth/popup-blocked': 'Popup bloqueado. Permite popups para este sitio.',
    'auth/popup-closed-by-user': 'Login cancelado por el usuario.',
  };
  
  const userMessage = errorMessages[error.code] || 'Error inesperado. Intenta más tarde.';
  
  return {
    code: error.code,
    message: userMessage,
    originalError: error
  };
};

// Retry mechanism for Firebase operations
export const retryFirebaseOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Firebase operation failed (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt === maxRetries) {
        throw handleFirebaseError(error);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};