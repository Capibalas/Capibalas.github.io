import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateSalesReport = (salesData, products, clients, month) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Importadora MAZARYX', 20, 20);
  doc.setFontSize(16);
  doc.text('Reporte de Ventas', 20, 30);
  doc.setFontSize(12);
  doc.text(`Período: ${month || 'Todos los meses'}`, 20, 40);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, 20, 50);

  // Sales summary table
  const salesSummary = calculateSalesSummary(salesData, products, clients);
  
  doc.autoTable({
    startY: 60,
    head: [['Métrica', 'Valor']],
    body: [
      ['Total de Ventas', salesSummary.totalSales.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })],
      ['Total de Unidades', salesSummary.totalUnits.toLocaleString()],
      ['Número de Transacciones', salesSummary.totalTransactions.toLocaleString()],
      ['Ticket Promedio', salesSummary.averageTicket.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })],
      ['Utilidad Bruta', salesSummary.grossProfit.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })],
      ['Margen Bruto %', `${salesSummary.grossMargin.toFixed(2)}%`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }
  });

  // Sales by product table
  const productSales = calculateProductSales(salesData, products);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Producto', 'Unidades Vendidas', 'Ingresos (MXN)', 'Margen Bruto %']],
    body: productSales.map(item => [
      item.productName,
      item.units.toLocaleString(),
      item.revenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
      `${item.margin.toFixed(2)}%`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }
  });

  // Sales by client table
  const clientSales = calculateClientSales(salesData, clients);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Cliente', 'Transacciones', 'Ingresos (MXN)', 'Ticket Promedio']],
    body: clientSales.map(item => [
      item.clientName,
      item.transactions.toLocaleString(),
      item.revenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
      item.averageTicket.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
  }

  return doc;
};

export const generateInventoryReport = (products, salesData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Importadora MAZARYX', 20, 20);
  doc.setFontSize(16);
  doc.text('Reporte de Inventario', 20, 30);
  doc.setFontSize(12);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, 20, 40);

  // Calculate current stock
  const inventoryData = calculateInventoryData(products, salesData);
  
  doc.autoTable({
    startY: 60,
    head: [['Producto', 'Stock Inicial', 'Vendido', 'Stock Actual', 'Estado']],
    body: inventoryData.map(item => [
      item.name,
      item.initialStock.toLocaleString(),
      item.sold.toLocaleString(),
      item.currentStock.toLocaleString(),
      item.status
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    didParseCell: function(data) {
      if (data.column.index === 4) { // Status column
        if (data.cell.text[0] === 'Stock Bajo') {
          data.cell.styles.textColor = [220, 38, 38]; // Red
        } else if (data.cell.text[0] === 'Stock Crítico') {
          data.cell.styles.textColor = [239, 68, 68]; // Darker red
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // Stock alerts
  const lowStockItems = inventoryData.filter(item => item.status !== 'Stock Normal');
  
  if (lowStockItems.length > 0) {
    doc.setFontSize(14);
    doc.text('⚠️ Alertas de Stock', 20, doc.lastAutoTable.finalY + 20);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Producto', 'Stock Actual', 'Recomendación']],
      body: lowStockItems.map(item => [
        item.name,
        item.currentStock.toLocaleString(),
        item.status === 'Stock Crítico' ? 'Reabastecer URGENTE' : 'Planificar reabastecimiento'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68] }
    });
  }

  return doc;
};

export const generateFinancialReport = (salesData, expensesData, products, month) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Importadora MAZARYX', 20, 20);
  doc.setFontSize(16);
  doc.text('Reporte Financiero', 20, 30);
  doc.setFontSize(12);
  doc.text(`Período: ${month || 'Todos los meses'}`, 20, 40);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, 20, 50);

  // Financial summary
  const financialSummary = calculateFinancialSummary(salesData, expensesData, products);
  
  doc.autoTable({
    startY: 60,
    head: [['Concepto', 'Monto (MXN)']],
    body: [
      ['Ingresos Totales', financialSummary.totalRevenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })],
      ['Costo de Ventas (COGS)', financialSummary.totalCOGS.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })],
      ['Utilidad Bruta', financialSummary.grossProfit.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })],
      ['Gastos Operativos', financialSummary.operatingExpenses.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })],
      ['Utilidad Neta', financialSummary.netProfit.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })],
      ['Margen Neto %', `${financialSummary.netMargin.toFixed(2)}%`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    didParseCell: function(data) {
      if (data.row.index === 4) { // Net profit row
        const value = financialSummary.netProfit;
        if (value < 0) {
          data.cell.styles.textColor = [220, 38, 38]; // Red for negative
        } else {
          data.cell.styles.textColor = [34, 197, 94]; // Green for positive
        }
      }
    }
  });

  // Expenses breakdown
  if (expensesData && Object.keys(expensesData).length > 0) {
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Categoría de Gasto', 'Monto (MXN)', '% del Total']],
      body: Object.entries(expensesData).map(([category, amount]) => [
        category,
        amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
        `${((amount / financialSummary.operatingExpenses) * 100).toFixed(1)}%`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }

  return doc;
};

// Helper functions
const calculateSalesSummary = (salesData, products, clients) => {
  let totalSales = 0;
  let totalUnits = 0;
  let totalCOGS = 0;
  
  salesData.forEach(sale => {
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      const revenue = sale.quantity * sale.unitPrice;
      const cogs = sale.quantity * product.costoMXN;
      
      totalSales += revenue;
      totalUnits += sale.quantity;
      totalCOGS += cogs;
    }
  });
  
  const grossProfit = totalSales - totalCOGS;
  const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
  const averageTicket = salesData.length > 0 ? totalSales / salesData.length : 0;
  
  return {
    totalSales,
    totalUnits,
    totalTransactions: salesData.length,
    averageTicket,
    grossProfit,
    grossMargin
  };
};

const calculateProductSales = (salesData, products) => {
  const productSales = {};
  
  salesData.forEach(sale => {
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      if (!productSales[product.id]) {
        productSales[product.id] = {
          productName: product.name,
          units: 0,
          revenue: 0,
          cogs: 0
        };
      }
      
      const revenue = sale.quantity * sale.unitPrice;
      const cogs = sale.quantity * product.costoMXN;
      
      productSales[product.id].units += sale.quantity;
      productSales[product.id].revenue += revenue;
      productSales[product.id].cogs += cogs;
    }
  });
  
  return Object.values(productSales).map(item => ({
    ...item,
    margin: item.revenue > 0 ? ((item.revenue - item.cogs) / item.revenue) * 100 : 0
  }));
};

const calculateClientSales = (salesData, clients) => {
  const clientSales = {};
  
  salesData.forEach(sale => {
    const client = clients.find(c => c.id === sale.clientId);
    if (client) {
      if (!clientSales[client.id]) {
        clientSales[client.id] = {
          clientName: client.name,
          transactions: 0,
          revenue: 0
        };
      }
      
      const revenue = sale.quantity * sale.unitPrice;
      clientSales[client.id].transactions += 1;
      clientSales[client.id].revenue += revenue;
    }
  });
  
  return Object.values(clientSales).map(item => ({
    ...item,
    averageTicket: item.transactions > 0 ? item.revenue / item.transactions : 0
  }));
};

const calculateInventoryData = (products, salesData) => {
  return products.map(product => {
    const totalSold = salesData
      .filter(sale => sale.productId === product.id)
      .reduce((sum, sale) => sum + sale.quantity, 0);
    
    const currentStock = product.stockInicial - totalSold;
    const stockPercentage = (currentStock / product.stockInicial) * 100;
    
    let status = 'Stock Normal';
    if (stockPercentage <= 5) {
      status = 'Stock Crítico';
    } else if (stockPercentage <= 15) {
      status = 'Stock Bajo';
    }
    
    return {
      name: product.name,
      initialStock: product.stockInicial,
      sold: totalSold,
      currentStock,
      status
    };
  });
};

const calculateFinancialSummary = (salesData, expensesData, products) => {
  let totalRevenue = 0;
  let totalCOGS = 0;
  
  salesData.forEach(sale => {
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      totalRevenue += sale.quantity * sale.unitPrice;
      totalCOGS += sale.quantity * product.costoMXN;
    }
  });
  
  const grossProfit = totalRevenue - totalCOGS;
  const operatingExpenses = expensesData ? Object.values(expensesData).reduce((sum, expense) => sum + expense, 0) : 0;
  const netProfit = grossProfit - operatingExpenses;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  return {
    totalRevenue,
    totalCOGS,
    grossProfit,
    operatingExpenses,
    netProfit,
    netMargin
  };
};