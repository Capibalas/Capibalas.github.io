import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const FirebaseDiagnostic = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  const addResult = (step, status, message, details = '') => {
    setResults(prev => [...prev, { step, status, message, details, timestamp: new Date() }]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setTesting(true);

    try {
      // Step 1: Check Firebase initialization
      setCurrentStep('Verificando inicialización de Firebase...');
      if (!db) {
        addResult('Firebase Init', 'error', 'Firebase no está inicializado', 
          'El objeto db es null. Verifica que Firebase esté importado correctamente.');
        setTesting(false);
        return;
      }
      addResult('Firebase Init', 'success', 'Firebase inicializado correctamente');

      // Step 2: Check Firestore database exists
      setCurrentStep('Verificando base de datos Firestore...');
      try {
        const testCollection = collection(db, 'test_connection');
        await getDocs(testCollection);
        addResult('Firestore Database', 'success', 'Base de datos Firestore accesible');
      } catch (error) {
        if (error.code === 'failed-precondition' || error.message?.includes('database does not exist')) {
          addResult('Firestore Database', 'error', 
            '¡La base de datos Firestore NO está creada!',
            'SOLUCIÓN:\n1. Ve a Firebase Console: https://console.firebase.google.com/\n2. Selecciona el proyecto "bestwhip-67e0b"\n3. En el menú lateral, haz clic en "Firestore Database"\n4. Haz clic en "Crear base de datos"\n5. Selecciona "Producción" o "Prueba"\n6. Elige la ubicación más cercana (ej: us-central)\n7. Haz clic en "Habilitar"');
          setTesting(false);
          return;
        }
        throw error;
      }

      // Step 3: Check read permissions
      setCurrentStep('Verificando permisos de lectura...');
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        addResult('Read Permission', 'success', 
          `Permisos de lectura OK - ${snapshot.docs.length} productos encontrados`);
      } catch (error) {
        addResult('Read Permission', 'error', 
          'Error de permisos de lectura',
          `Error: ${error.message}\n\nSOLUCIÓN: Verifica las reglas de Firestore en Firebase Console`);
        throw error;
      }

      // Step 4: Check write permissions
      setCurrentStep('Verificando permisos de escritura...');
      try {
        const testDoc = {
          test: true,
          timestamp: new Date(),
          message: 'Test document'
        };
        const docRef = await addDoc(collection(db, 'test_diagnostic'), testDoc);
        addResult('Write Permission', 'success', 'Permisos de escritura OK');
        
        // Clean up test document
        await deleteDoc(doc(db, 'test_diagnostic', docRef.id));
        addResult('Cleanup', 'success', 'Documento de prueba eliminado');
      } catch (error) {
        addResult('Write Permission', 'error', 
          'Error de permisos de escritura',
          `Error: ${error.message}\n\nSOLUCIÓN: Verifica las reglas de Firestore`);
        throw error;
      }

      // Step 5: Check products collection specifically
      setCurrentStep('Verificando colección de productos...');
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        if (snapshot.empty) {
          addResult('Products Collection', 'warning', 
            'La colección de productos está VACÍA',
            'Esto explica por qué no aparecen productos.\n\nSOLUCIÓN: Usa el panel de "🌱 Productos" para poblar la base de datos.');
        } else {
          addResult('Products Collection', 'success', 
            `Se encontraron ${snapshot.docs.length} productos`,
            `Productos: ${snapshot.docs.map(d => d.data().title || 'Sin título').join(', ')}`);
        }
      } catch (error) {
        addResult('Products Collection', 'error', 
          'Error al leer productos',
          `Error: ${error.message}`);
      }

      addResult('Complete', 'success', '¡Diagnóstico completado!');

    } catch (error) {
      addResult('Error', 'error', 
        'Error durante el diagnóstico',
        `${error.code || 'Unknown'}: ${error.message}`);
    } finally {
      setTesting(false);
      setCurrentStep('');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '🔵';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          🔍 Diagnóstico de Firebase
        </h2>

        <div className="mb-6">
          <button
            onClick={runDiagnostics}
            disabled={testing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {testing ? `⏳ Ejecutando... ${currentStep}` : '🚀 Ejecutar Diagnóstico Completo'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 mb-3">Resultados del Diagnóstico:</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{getStatusIcon(result.status)}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      {result.step}: {result.message}
                    </h4>
                    {result.details && (
                      <pre className="text-sm mt-2 whitespace-pre-wrap font-mono bg-white bg-opacity-50 p-3 rounded">
                        {result.details}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Pasos comunes de solución:</h4>
          <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
            <li>
              <strong>Si la base de datos no existe:</strong> Créala en Firebase Console
              <br/>
              <a 
                href="https://console.firebase.google.com/project/bestwhip-67e0b/firestore" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 ml-6"
              >
                → Ir a Firestore Database
              </a>
            </li>
            <li>
              <strong>Si hay errores de permisos:</strong> Verifica las reglas en Firebase Console
            </li>
            <li>
              <strong>Si la colección está vacía:</strong> Usa el panel "🌱 Productos" para poblar datos
            </li>
            <li>
              <strong>Si persisten los errores:</strong> Revisa la consola del navegador (F12) para más detalles
            </li>
          </ol>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">📋 Información del Proyecto:</h4>
          <div className="text-sm text-gray-700 space-y-1 font-mono">
            <div>Project ID: <strong>bestwhip-67e0b</strong></div>
            <div>Auth Domain: <strong>bestwhip-67e0b.firebaseapp.com</strong></div>
            <div>Console: <a 
              href="https://console.firebase.google.com/project/bestwhip-67e0b" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Abrir en Firebase Console
            </a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseDiagnostic;