const ProductTable = ({ products, salesByProduct, allSales }) => {
  // Calculate total sold for each product across all time
  const getTotalSold = (productId) => {
    return allSales
      .filter(sale => sale.productId === productId)
      .reduce((sum, sale) => sum + sale.quantity, 0);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">📦 Inventario y Rendimiento de Productos</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3">Producto</th>
              <th scope="col" className="px-6 py-3 text-center">Stock Actual</th>
              <th scope="col" className="px-6 py-3 text-right">Ventas (Uds)</th>
              <th scope="col" className="px-6 py-3 text-right">Ingresos (MXN)</th>
              <th scope="col" className="px-6 py-3 text-right">Margen Bruto</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const productSales = salesByProduct[product.id] || { units: 0, revenue: 0, cogs: 0 };
              const totalSold = getTotalSold(product.id);
              const stockActual = product.stockInicial - totalSold;
              const stockPercentage = (stockActual / product.stockInicial) * 100;
              const isLowStock = stockPercentage <= 15;
              const isCriticalStock = stockPercentage <= 5;
              const productMargin = productSales.revenue > 0 ? 
                ((productSales.revenue - productSales.cogs) / productSales.revenue) * 100 : 0;

              return (
                <tr key={product.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold">{stockActual.toLocaleString()}</span>
                    <span 
                      className={`ml-2 inline-block w-3 h-3 rounded-full ${
                        isCriticalStock ? 'bg-red-500' : 
                        isLowStock ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      title={
                        isCriticalStock ? 'Stock Crítico' :
                        isLowStock ? 'Stock Bajo' : 'Stock Normal'
                      }
                    ></span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {productSales.units.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {productSales.revenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${
                    productMargin >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {productMargin.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Stock Alerts */}
      <div className="mt-4 p-4 bg-slate-50 rounded-lg">
        <h3 className="font-semibold text-slate-800 mb-2">🚨 Alertas de Stock</h3>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Stock Normal ({'>'}15%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span>Stock Bajo (5-15%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Stock Crítico ({'≤'}5%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;