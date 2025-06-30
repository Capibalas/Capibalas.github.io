import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Doughnut, Pie } from 'react-chartjs-2';
import {
  productsService,
  clientsService,
  salesService,
  pricingService,
  expensesService,
  seedInitialData,
  checkIfDataExists
} from '../config/dataSource';
import { generateSalesReport, generateInventoryReport, generateFinancialReport } from '../utils/pdfGenerator';
import ProductConfig from './ProductConfig';
import ProductManager from './ProductManager';
import ClientConfig from './ClientConfig';
import SalesEntry from './SalesEntry';
import KPICards from './KPICards';
import ProductTable from './ProductTable';
import ExpensesTable from './ExpensesTable';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const [data, setData] = useState({
    products: [],
    clients: [],
    sales: [],
    pricing: {},
    expenses: {}
  });
  
  const [filters, setFilters] = useState({
    month: '2025-06',
    clientId: 'all',
    tipoCambio: 18.50
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load initial data
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      initializeData();
    }
  }, [initialized]);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // Check if data exists, if not, seed it
      const dataExists = await checkIfDataExists();
      if (!dataExists) {
        setSeeding(true);
        await seedInitialData();
        setSeeding(false);
      }
      
      await loadData();
    } catch (err) {
      setError('Error initializing data: ' + err.message);
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [products, clients, sales, pricing, expenses] = await Promise.all([
        productsService.getProducts(),
        clientsService.getClients(),
        salesService.getSales(),
        pricingService.getPricing(),
        expensesService.getAllExpenses()
      ]);

      // Ensure all data is arrays (handle undefined/null cases)
      const safeProducts = Array.isArray(products) ? products : [];
      const safeClients = Array.isArray(clients) ? clients : [];
      const safeSales = Array.isArray(sales) ? sales : [];
      const safePricing = Array.isArray(pricing) ? pricing : [];
      const safeExpenses = Array.isArray(expenses) ? expenses : [];

      // Transform pricing data to object format
      const pricingObj = {};
      safePricing.forEach(p => {
        if (p && p.clientId && p.productId) {
          if (!pricingObj[p.clientId]) pricingObj[p.clientId] = {};
          pricingObj[p.clientId][p.productId] = p.price;
        }
      });

      // Transform expenses data to object format
      const expensesObj = {};
      safeExpenses.forEach(e => {
        if (e && e.month) {
          expensesObj[e.month] = { ...e };
          delete expensesObj[e.month].month;
          delete expensesObj[e.month].createdAt;
          delete expensesObj[e.month].updatedAt;
        }
      });

      setData({
        products: safeProducts,
        clients: safeClients,
        sales: safeSales,
        pricing: pricingObj,
        expenses: expensesObj
      });

      console.log(`Loaded data: ${safeProducts.length} products, ${safeClients.length} clients, ${safeSales.length} sales`);
    } catch (err) {
      setError('Error loading data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter sales data based on current filters
  const getFilteredSales = () => {
    let filteredSales = data.sales;
    
    if (filters.month !== 'all') {
      const startDate = new Date(filters.month + '-01');
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      filteredSales = filteredSales.filter(sale => {
        const saleDate = sale.date.toDate ? sale.date.toDate() : new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
      });
    }
    
    if (filters.clientId !== 'all') {
      filteredSales = filteredSales.filter(sale => sale.clientId === filters.clientId);
    }
    
    return filteredSales;
  };

  // Calculate KPIs
  const calculateKPIs = () => {
    const filteredSales = getFilteredSales();
    let totalIngresos = 0;
    let totalCogs = 0;
    let salesByProduct = {};
    let salesByChannel = {};

    data.products.forEach(p => {
      salesByProduct[p.id] = { units: 0, revenue: 0, cogs: 0 };
    });

    filteredSales.forEach(sale => {
      const product = data.products.find(p => p.id === sale.productId);
      const clientPrice = (data.pricing[sale.clientId] || {})[sale.productId] || 0;
      
      if (product && clientPrice) {
        const revenue = sale.quantity * clientPrice;
        const cogs = sale.quantity * product.costoMXN;
        
        totalIngresos += revenue;
        totalCogs += cogs;
        
        salesByProduct[product.id].units += sale.quantity;
        salesByProduct[product.id].revenue += revenue;
        salesByProduct[product.id].cogs += cogs;
        
        const channel = sale.channel || 'Mayoreo';
        salesByChannel[channel] = (salesByChannel[channel] || 0) + revenue;
      }
    });

    const currentMonthExpenses = data.expenses[filters.month] || {};
    const totalGastosOp = filters.month === 'all' ? 0 : Object.values(currentMonthExpenses).reduce((s, v) => s + v, 0);
    
    const utilidadBruta = totalIngresos - totalCogs;
    const utilidadNeta = utilidadBruta - totalGastosOp;
    const margenNeto = totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0;
    const ticketPromedio = filteredSales.length > 0 ? totalIngresos / filteredSales.length : 0;

    return {
      totalIngresos,
      totalCogs,
      utilidadBruta,
      utilidadNeta,
      margenNeto,
      ticketPromedio,
      totalGastosOp,
      salesByProduct,
      salesByChannel
    };
  };

  // Generate sales trend data for chart
  const getSalesTrendData = () => {
    const monthlyData = {};
    
    data.sales.forEach(sale => {
      const saleDate = sale.date.toDate ? sale.date.toDate() : new Date(sale.date);
      const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) monthlyData[monthKey] = 0;
      
      const product = data.products.find(p => p.id === sale.productId);
      const clientPrice = (data.pricing[sale.clientId] || {})[sale.productId] || 0;
      
      if (product && clientPrice) {
        monthlyData[monthKey] += sale.quantity * clientPrice;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    
    return {
      labels: sortedMonths,
      datasets: [{
        label: 'Ingresos Mensuales (MXN)',
        data: sortedMonths.map(month => monthlyData[month]),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3
      }]
    };
  };

  // Generate PDF reports
  const generatePDF = (type) => {
    const filteredSales = getFilteredSales();
    let doc;
    
    switch (type) {
      case 'sales':
        doc = generateSalesReport(filteredSales, data.products, data.clients, filters.month);
        doc.save(`reporte-ventas-${filters.month || 'todos'}.pdf`);
        break;
      case 'inventory':
        doc = generateInventoryReport(data.products, data.sales);
        doc.save(`reporte-inventario-${new Date().toISOString().split('T')[0]}.pdf`);
        break;
      case 'financial':
        const expensesData = data.expenses[filters.month] || {};
        doc = generateFinancialReport(filteredSales, expensesData, data.products, filters.month);
        doc.save(`reporte-financiero-${filters.month || 'todos'}.pdf`);
        break;
    }
  };

  const kpis = calculateKPIs();
  const salesTrendData = getSalesTrendData();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">
            {seeding ? 'Configurando datos iniciales...' : 'Cargando dashboard...'}
          </p>
          {seeding && (
            <p className="text-sm text-slate-500 mt-2">
              Esto puede tomar unos momentos la primera vez
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <header className="mb-12">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Dashboard Ejecutivo
                </h1>
                <p className="text-slate-600 text-lg font-medium">Importadora MAZARYX | Best Whip</p>
                <div className="flex items-center mt-3 space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    ● En línea
                  </span>
                  <span className="text-slate-500 text-sm">
                    Última actualización: {new Date().toLocaleString('es-MX')}
                  </span>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Global Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 mb-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <label htmlFor="month-selector" className="block text-sm font-semibold text-slate-700">Mes de Análisis</label>
            <select
              id="month-selector"
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
              className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/70 backdrop-blur-sm py-3 px-4 font-medium"
            >
              <option value="all">Todos los Meses</option>
              <option value="2025-06">Junio 2025</option>
              <option value="2025-05">Mayo 2025</option>
              <option value="2025-04">Abril 2025</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="client-selector" className="block text-sm font-semibold text-slate-700">Cliente</label>
            <select
              id="client-selector"
              value={filters.clientId}
              onChange={(e) => setFilters(prev => ({ ...prev, clientId: e.target.value }))}
              className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm py-3 px-4 font-medium"
            >
              <option value="all">Todos los Clientes</option>
              {data.clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tipo-cambio" className="block text-sm font-semibold text-slate-700">Tipo de Cambio (USD)</label>
            <input
              type="number"
              id="tipo-cambio"
              value={filters.tipoCambio}
              onChange={(e) => setFilters(prev => ({ ...prev, tipoCambio: parseFloat(e.target.value) || 18.50 }))}
              step="0.01"
              className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70 backdrop-blur-sm py-3 px-4 font-medium"
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => generatePDF('sales')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>📊</span>
              <span>PDF Ventas</span>
            </button>
            <button
              onClick={() => generatePDF('financial')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>💰</span>
              <span>PDF Financiero</span>
            </button>
          </div>
        </div>

        {/* Product Manager - New Section */}
        <div className="mb-8">
          <ProductManager />
        </div>

        {/* Configuration and Sales Entry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProductConfig
            products={data.products}
            clients={data.clients}
            pricing={data.pricing}
            onDataUpdate={loadData}
          />
          <SalesEntry
            products={data.products}
            clients={data.clients}
            onSaleAdded={loadData}
          />
        </div>

        {/* KPI Cards */}
        <KPICards 
          kpis={kpis}
          tipoCambio={filters.tipoCambio}
        />

        {/* Charts Section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-800 mb-4">💸 Tendencia de Ventas</h2>
              <div className="h-80">
                <Line 
                  data={salesTrendData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Ventas por Canal</h3>
                <div className="h-40">
                  <Doughnut 
                    data={{
                      labels: Object.keys(kpis.salesByChannel),
                      datasets: [{
                        data: Object.values(kpis.salesByChannel),
                        backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#8b5cf6']
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top'
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Ticket Promedio</h3>
                <p className="text-4xl font-extrabold text-slate-800 text-center">
                  {kpis.ticketPromedio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Performance Table */}
        <ProductTable 
          products={data.products}
          salesByProduct={kpis.salesByProduct}
          allSales={data.sales}
        />

        {/* Expenses and Cash Flow */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">💰 Costos y Flujo de Efectivo</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <ExpensesTable 
                month={filters.month}
                expenses={data.expenses}
                onExpensesUpdate={loadData}
              />
            </div>
            
            <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-4">📆 Flujo de Efectivo del Mes</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-slate-500 text-sm">Entradas (Ingresos)</p>
                  <p className="text-2xl font-bold text-green-600">
                    {kpis.totalIngresos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Salidas (COGS + Gastos)</p>
                  <p className="text-2xl font-bold text-red-600">
                    {(kpis.totalCogs + kpis.totalGastosOp).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Flujo Neto</p>
                  <p className={`text-2xl font-bold ${kpis.utilidadNeta >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {kpis.utilidadNeta.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-center mb-2">Composición de Salidas</h4>
                <div className="h-48">
                  <Pie 
                    data={{
                      labels: ['COGS', ...Object.keys(data.expenses[filters.month] || {})],
                      datasets: [{
                        data: [kpis.totalCogs, ...Object.values(data.expenses[filters.month] || {})],
                        backgroundColor: ['#ef4444', '#f59e0b', '#84cc16', '#14b8a6', '#6366f1', '#d946ef']
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;