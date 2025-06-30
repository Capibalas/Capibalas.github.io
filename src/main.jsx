import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import Firebase test utility for development
import './utils/testFirebase.js'

// Import utility functions for debugging
import { fixProductDataStructure } from './utils/fixDataStructure.js'
import { reseedData } from './utils/reseedData.js'

// Make utility functions available in browser console for debugging
window.fixProductDataStructure = fixProductDataStructure
window.reseedData = reseedData

console.log('🔧 Debug utilities available:')
console.log('- window.fixProductDataStructure() - Fix existing product data structure')
console.log('- window.reseedData() - Clear and reseed all data')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
