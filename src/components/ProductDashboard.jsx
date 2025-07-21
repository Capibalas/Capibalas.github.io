import { useState, useEffect, useMemo } from 'react';
import { productsService, salesService } from '../config/dataSource';

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, salesData] = await Promise.all([
        productsService.getProducts(),
        salesService.getSales()
      ]);
      setProducts(productsData);
      setSales(salesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const periodDays = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);

    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= cutoffDate;
    });

    const filteredProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    return { sales: filteredSales, products: filteredProducts };
  }, [sales, products, selectedPeriod, selectedCategory]);

  const analytics = useMemo(() => {
    const { sales, products } = filteredData;

    // Calculate product performance
    const productSales = {};
    sales.forEach(sale => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = { units: 0, revenue: 0 };
      }
      productSales[sale.productId].units += sale.quantity;
      productSales[sale.productId].revenue += sale.total;
    });

    // Calculate analytics
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock || 0), 0);
    const lowStockProducts = products.filter(p => p.stock <= 5).length;
    const outOfStockProducts = products.filter(p => p.stock <= 0).length;

    // Calculate sales analytics
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalUnitsSold = sales.reduce((sum, s) => sum + s.quantity, 0);
    const averageOrderValue = sales.length > 0 ? totalSales / sales.length : 0;

    // Top selling products
    const topProducts = products
      .map(product => ({
        ...product,
        unitsSold: productSales[product.id]?.units || 0,
        revenue: productSales[product.id]?.revenue || 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Category performance
    const categoryPerformance = {};
    products.forEach(product => {
      if (!categoryPerformance[product.category]) {
        categoryPerformance[product.category] = { products: 0, stock: 0, value: 0 };
      }
      categoryPerformance[product.category].products++;
      categoryPerformance[product.category].stock += product.stock || 0;
      categoryPerformance[product.category].value += (product.price * product.stock) || 0;
    });

    return {
      totalProducts,
      totalStock,
      totalValue,
      lowStockProducts,
      outOfStockProducts,
      totalSales,
      totalUnitsSold,
      averageOrderValue,
      topProducts,
      categoryPerformance,
      productSales
    };
  }, [filteredData]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const stockStatus = (stock) => {
    if (stock <= 0) return { label: 'Sin stock', color: 'bg-red-500' };
    if (stock <= 5) return { label: 'Crítico', color: 'bg-orange-500' };
    if (stock <= 15) return { label: 'Bajo', color: 'bg-yellow-500' };
    return { label: 'Normal', color: 'bg-green-500' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">📊 Dashboard de Productos</h2>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="365">Último año</option>
          </select>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas las categorías' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-slate-800">{analytics.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Total</p>
              <p className="text-2xl font-bold text-slate-800">{analytics.totalStock.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
              <p className="text-2xl font-bold text-slate-800">${analytics.totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Período</p>
              <p className="text-2xl font-bold text-slate-800">${analytics.totalSales.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">🚨 Alertas de Stock</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-semibold text-red-800">Sin Stock</p>
                <p className="text-sm text-red-600">{analytics.outOfStockProducts} productos</p>
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-semibold text-orange-800">Stock Crítico</p>
                <p className="text-sm text-orange-600">{analytics.lowStockProducts} productos</p>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚠</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">🏆 Top Productos Más Vendidos</h3>
          
          <div className="space-y-3">
            {analytics.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{product.title}</p>
                    <p className="text-xs text-gray-600">{product.unitsSold} unidades vendidas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 mb-4">📈 Rendimiento por Categoría</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Categoría</th>
                <th className="text-center py-2">Productos</th>
                <th className="text-center py-2">Stock</th>
                <th className="text-right py-2">Valor</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics.categoryPerformance).map(([category, data]) => (
                <tr key={category} className="border-b">
                  <td className="py-2 capitalize">{category}</td>
                  <td className="text-center py-2">{data.products}</td>
                  <td className="text-center py-2">{data.stock.toLocaleString()}</td>
                  <td className="text-right py-2">${data.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product List with Status */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 mb-4">📋 Lista de Productos</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Producto</th>
                <th className="text-center py-2">Stock</th>
                <th className="text-center py-2">Precio</th>
                <th className="text-center py-2">Estado</th>
                <th className="text-right py-2">Ventas</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const productSale = analytics.productSales[product.id] || { units: 0, revenue: 0 };
                const status = stockStatus(product.stock || 0);
                
                return (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">
                      <div>
                        <p className="font-semibold">{product.title}</p>
                        <p className="text-xs text-gray-600">{product.category}</p>
                      </div>
                    </td>
                    <td className="text-center py-2">{product.stock || 0}</td>
                    <td className="text-center py-2">${product.price || 0}</td>
                    <td className="text-center py-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${status.color} mr-1`}></span>
                      {status.label}
                    </td>
                    <td className="text-right py-2">
                      <p className="font-semibold">{productSale.units} uds</p>
                      <p className="text-xs text-gray-600">${productSale.revenue}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;