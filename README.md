# Best Whip MX - React Dashboard Application

Una aplicación completa de gestión financiera y comercial para Importadora MAZARYX, distribuidor oficial de productos Best Whip en México.

## 🚀 Características

### Landing Page
- **Hero Section**: Presentación atractiva con animaciones
- **Catálogo de Productos**: Showcase de productos Best Whip
- **Formulario de Contacto**: Captura de leads B2B
- **Diseño Responsivo**: Optimizado para todos los dispositivos

### Dashboard Financiero
- **Gestión de Productos**: CRUD completo con control de inventario
- **Gestión de Clientes**: Administración de base de clientes
- **Configuración de Precios**: Precios personalizados por cliente
- **Registro de Ventas**: Sistema de captura de transacciones
- **KPIs en Tiempo Real**: Métricas financieras actualizadas
- **Reportes PDF**: Generación automática de reportes
- **Análisis de Tendencias**: Gráficos interactivos con Chart.js
- **Control de Gastos**: Seguimiento de gastos operativos
- **Flujo de Efectivo**: Análisis de entradas y salidas

### Tecnologías Utilizadas
- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Gráficos**: Chart.js, React-Chart.js-2
- **PDF**: jsPDF, jsPDF-AutoTable
- **Routing**: React Router DOM
- **Deployment**: GitHub Pages

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm
- Cuenta de Firebase

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd best-whip-landing
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Configurar Firebase**
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilitar Firestore Database
   - Habilitar Authentication (opcional)
   - Copiar la configuración en `src/firebase/config.js`

4. **Ejecutar en desarrollo**
```bash
npm run dev
# o
pnpm dev
```

5. **Construir para producción**
```bash
npm run build
# o
pnpm build
```

## 🗂️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── Dashboard.jsx    # Dashboard principal
│   ├── Hero.jsx         # Sección hero
│   ├── Products.jsx     # Catálogo de productos
│   ├── ContactForm.jsx  # Formulario de contacto
│   ├── KPICards.jsx     # Tarjetas de métricas
│   ├── ProductConfig.jsx # Configuración de productos
│   ├── SalesEntry.jsx   # Registro de ventas
│   ├── ProductTable.jsx # Tabla de productos
│   └── ExpensesTable.jsx # Tabla de gastos
├── firebase/            # Configuración Firebase
│   ├── config.js        # Configuración
│   └── services.js      # Servicios CRUD
├── utils/               # Utilidades
│   ├── pdfGenerator.js  # Generación de PDFs
│   └── seedData.js      # Datos iniciales
└── App.jsx              # Componente principal
```

## 🔥 Firebase Collections

### Products
```javascript
{
  id: string,
  name: string,
  costoMXN: number,
  stockInicial: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Clients
```javascript
{
  id: string,
  name: string,
  email?: string,
  phone?: string,
  address?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Sales
```javascript
{
  id: string,
  date: timestamp,
  clientId: string,
  productId: string,
  quantity: number,
  channel: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Pricing
```javascript
{
  id: string,
  clientId: string,
  productId: string,
  price: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Expenses
```javascript
{
  id: string,
  month: string, // "YYYY-MM"
  Renta: number,
  Sueldos: number,
  Publicidad: number,
  Logística: number,
  Otros: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 📊 Funcionalidades del Dashboard

### Gestión de Datos
- **Productos**: Agregar, editar costos y stock inicial
- **Clientes**: Crear nuevos clientes con información de contacto
- **Precios**: Configurar precios personalizados por cliente/producto
- **Ventas**: Registrar transacciones con múltiples productos
- **Gastos**: Controlar gastos operativos mensuales

### Análisis y Reportes
- **KPIs**: Ingresos, utilidad bruta/neta, margen neto
- **Tendencias**: Gráfico de ventas mensuales
- **Canales**: Distribución por canal de venta
- **Inventario**: Control de stock con alertas
- **Flujo de Efectivo**: Análisis de entradas vs salidas

### Generación de PDFs
- **Reporte de Ventas**: Resumen completo de ventas por período
- **Reporte de Inventario**: Estado actual del inventario
- **Reporte Financiero**: Análisis financiero completo

## 🎨 Personalización

### Colores y Tema
Los colores principales se pueden modificar en `tailwind.config.js`:
- Primario: Indigo/Blue (#4f46e5)
- Secundario: Red (#ef4444)
- Fondo: Slate (#f1f5f9)

### Datos Iniciales
Los datos de ejemplo se configuran en `src/utils/seedData.js` y se cargan automáticamente en la primera ejecución.

## 🚀 Deployment

### GitHub Pages
```bash
npm run build
npm run deploy
```

### Netlify/Vercel
1. Conectar el repositorio
2. Configurar build command: `npm run build`
3. Configurar publish directory: `dist`

## 🔧 Configuración Avanzada

### Variables de Entorno
Crear `.env.local` para configuraciones sensibles:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Reglas de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Configurar según necesidades
    }
  }
}
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px  
- **Mobile**: 320px - 767px

## 🛠️ Desarrollo

### Scripts Disponibles
- `npm run dev`: Servidor de desarrollo
- `npm run build`: Construir para producción
- `npm run preview`: Vista previa de producción
- `npm run lint`: Linter ESLint

### Estructura de Componentes
Cada componente sigue el patrón:
1. Imports
2. Estado local
3. Efectos y funciones
4. Render JSX
5. Export

## 📈 Métricas y Analytics

El dashboard incluye:
- **Ingresos Totales**: En MXN y USD
- **Utilidad Bruta**: Ingresos - COGS
- **Utilidad Neta**: Utilidad Bruta - Gastos Operativos
- **Margen Neto**: Porcentaje de utilidad sobre ingresos
- **Ticket Promedio**: Valor promedio por transacción
- **Rotación de Inventario**: Análisis de stock

## 🔒 Seguridad

- Validación de datos en frontend
- Reglas de seguridad en Firestore
- Sanitización de inputs
- Manejo seguro de errores

## 📞 Soporte

Para soporte técnico o consultas:
- Email: tech@bestwhipmx.com
- Documentación: [Firebase Docs](https://firebase.google.com/docs)
- React: [React Docs](https://react.dev)

## 📄 Licencia

© 2025 Importadora MAZARYX S.A. de C.V. Todos los derechos reservados.
