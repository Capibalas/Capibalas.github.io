# Configuración de Firebase para Best Whip MX

## Estado Actual
✅ **La aplicación está funcionando con datos mock**
🔧 **Firebase necesita configuración adicional**

## Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto llamado "bestwhip-67e0b" (o usa el existente)
3. Habilita Google Analytics (opcional)

### 2. Configurar Firestore Database
1. En el panel izquierdo, ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Modo de prueba** (para desarrollo)
4. Elige una ubicación (recomendado: us-central1)

### 3. Configurar Reglas de Firestore
En la pestaña **Reglas** de Firestore, pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura para desarrollo
    // En producción, implementar autenticación adecuada
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Verificar Configuración Web
1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. En la pestaña **General**, busca **Tus apps**
3. Si no hay una app web, haz clic en **Agregar app** > **Web**
4. Registra la app con el nombre "Best Whip MX"
5. Copia la configuración que aparece

### 5. Actualizar Configuración Local
La configuración actual en `src/firebase/config.js` es:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCKh6ifKk0fXQlAy-ixQq-JRoAh4ppjUl0",
  authDomain: "bestwhip-67e0b.firebaseapp.com",
  projectId: "bestwhip-67e0b",
  storageBucket: "bestwhip-67e0b.firebasestorage.app",
  messagingSenderId: "886546495426",
  appId: "1:886546495426:web:f8f87f0938ec2dfec8085b",
  measurementId: "G-GEJR9MKLTL"
};
```

**Verifica que estos valores coincidan con tu proyecto.**

### 6. Habilitar Firebase en la Aplicación
Una vez que Firebase esté configurado correctamente:

1. Abre `src/config/dataSource.js`
2. Cambia `USE_FIREBASE` de `false` a `true`:

```javascript
export const USE_FIREBASE = true; // Cambiar a true cuando Firebase esté listo
```

### 7. Probar la Conexión
1. Reinicia el servidor de desarrollo: `npm run dev`
2. Ve al dashboard: `http://localhost:5173/dashboard`
3. La aplicación debería cargar datos desde Firebase

## Estructura de Datos en Firestore

### Colecciones que se crearán automáticamente:

#### `products`
```javascript
{
  name: "Cápsulas Caja x10",
  costoMXN: 83.25,
  stockInicial: 2400,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `clients`
```javascript
{
  name: "PROESA",
  email: "compras@proesa.com",
  phone: "+52 55 1234-5678",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `sales`
```javascript
{
  date: timestamp,
  clientId: "client_id",
  productId: "product_id",
  quantity: 150,
  channel: "Mayoreo",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `pricing`
```javascript
{
  clientId: "client_id",
  productId: "product_id",
  price: 135.00,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `expenses`
```javascript
{
  month: "2025-06",
  Renta: 15000,
  Sueldos: 30000,
  Publicidad: 5000,
  Logística: 8000,
  Otros: 2000,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Solución de Problemas

### Error: "Permission denied"
- Verifica que las reglas de Firestore permitan lectura/escritura
- Asegúrate de que el proyecto esté en modo de prueba

### Error: "Firebase not initialized"
- Verifica que la configuración en `config.js` sea correcta
- Asegúrate de que el proyecto existe en Firebase Console

### Error: "Network error"
- Verifica tu conexión a internet
- Comprueba que el proyecto no esté pausado en Firebase

### Los datos no aparecen
- La primera vez, la aplicación creará datos de ejemplo automáticamente
- Verifica en Firebase Console > Firestore que las colecciones se hayan creado

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## Próximos Pasos (Producción)

1. **Autenticación**: Implementar Firebase Auth
2. **Reglas de Seguridad**: Configurar reglas basadas en usuarios
3. **Índices**: Optimizar consultas con índices compuestos
4. **Backup**: Configurar respaldos automáticos
5. **Monitoreo**: Configurar alertas y métricas

## Soporte

Si encuentras problemas:
1. Revisa la consola del navegador para errores
2. Verifica la configuración en Firebase Console
3. Asegúrate de que todas las dependencias estén instaladas
4. Consulta la documentación de Firebase: https://firebase.google.com/docs