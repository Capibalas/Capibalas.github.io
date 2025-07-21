import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProductRouter from './components/ProductRouter';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductRouter />} />
            <Route path="/products" element={<ProductRouter />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;