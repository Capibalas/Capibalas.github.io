// Mock data service that simulates Firebase functionality
// This allows the app to work without Firebase configuration

let mockDB = {
  products: [
    { id: '1', name: "Cápsulas Caja x10", costoMXN: 83.25, stockInicial: 2400 },
    { id: '2', name: "Cápsulas Caja x24", costoMXN: 181.30, stockInicial: 1000 },
    { id: '3', name: "Sifón Inox 0.5L", costoMXN: 462.50, stockInicial: 100 },
    { id: '4', name: "Sifón Inox 1.0L", costoMXN: 650.00, stockInicial: 50 }
  ],
  clients: [
    { id: '1', name: "PROESA", email: "compras@proesa.com", phone: "+52 55 1234-5678" },
    { id: '2', name: "Café Etrusca", email: "pedidos@etrusca.mx", phone: "+52 55 2345-6789" },
    { id: '3', name: "Venta en Línea", email: "online@bestwhipmx.com", phone: "+52 55 3456-7890" },
    { id: '4', name: "CHEFMART", email: "ventas@chefmart.mx", phone: "+52 55 4567-8901" }
  ],
  sales: [
    // April 2025
    { id: '1', date: new Date('2025-04-05'), clientId: '1', productId: '1', quantity: 150, channel: "Mayoreo" },
    { id: '2', date: new Date('2025-04-10'), clientId: '3', productId: '2', quantity: 70, channel: "En línea" },
    { id: '3', date: new Date('2025-04-15'), clientId: '2', productId: '3', quantity: 10, channel: "Mayoreo" },
    { id: '4', date: new Date('2025-04-20'), clientId: '4', productId: '1', quantity: 200, channel: "Mayoreo" },
    
    // May 2025
    { id: '5', date: new Date('2025-05-03'), clientId: '1', productId: '1', quantity: 250, channel: "Mayoreo" },
    { id: '6', date: new Date('2025-05-08'), clientId: '3', productId: '2', quantity: 120, channel: "En línea" },
    { id: '7', date: new Date('2025-05-12'), clientId: '2', productId: '3', quantity: 15, channel: "Mayoreo" },
    { id: '8', date: new Date('2025-05-18'), clientId: '4', productId: '4', quantity: 8, channel: "Mayoreo" },
    { id: '9', date: new Date('2025-05-25'), clientId: '1', productId: '2', quantity: 100, channel: "Mayoreo" },
    
    // June 2025
    { id: '10', date: new Date('2025-06-02'), clientId: '1', productId: '1', quantity: 300, channel: "Mayoreo" },
    { id: '11', date: new Date('2025-06-07'), clientId: '3', productId: '2', quantity: 150, channel: "En línea" },
    { id: '12', date: new Date('2025-06-11'), clientId: '2', productId: '3', quantity: 25, channel: "Mayoreo" },
    { id: '13', date: new Date('2025-06-16'), clientId: '4', productId: '1', quantity: 180, channel: "Mayoreo" },
    { id: '14', date: new Date('2025-06-20'), clientId: '2', productId: '4', quantity: 12, channel: "Mayoreo" },
    { id: '15', date: new Date('2025-06-25'), clientId: '3', productId: '1', quantity: 80, channel: "En línea" }
  ],
  pricing: [
    // PROESA
    { id: '1_1', clientId: '1', productId: '1', price: 135.00 },
    { id: '1_2', clientId: '1', productId: '2', price: 290.00 },
    { id: '1_3', clientId: '1', productId: '3', price: 840.00 },
    { id: '1_4', clientId: '1', productId: '4', price: 1150.00 },
    
    // Café Etrusca
    { id: '2_1', clientId: '2', productId: '1', price: 138.50 },
    { id: '2_2', clientId: '2', productId: '2', price: 295.00 },
    { id: '2_3', clientId: '2', productId: '3', price: 850.00 },
    { id: '2_4', clientId: '2', productId: '4', price: 1180.00 },
    
    // Venta en Línea
    { id: '3_1', clientId: '3', productId: '1', price: 150.00 },
    { id: '3_2', clientId: '3', productId: '2', price: 320.00 },
    { id: '3_3', clientId: '3', productId: '3', price: 950.00 },
    { id: '3_4', clientId: '3', productId: '4', price: 1300.00 },
    
    // CHEFMART
    { id: '4_1', clientId: '4', productId: '1', price: 140.00 },
    { id: '4_2', clientId: '4', productId: '2', price: 300.00 },
    { id: '4_3', clientId: '4', productId: '3', price: 860.00 },
    { id: '4_4', clientId: '4', productId: '4', price: 1200.00 }
  ],
  expenses: [
    { id: '2025-04', month: '2025-04', Renta: 14000, Sueldos: 28000, Publicidad: 4500, Logística: 7000, Otros: 1800 },
    { id: '2025-05', month: '2025-05', Renta: 14500, Sueldos: 29000, Publicidad: 5500, Logística: 7500, Otros: 2100 },
    { id: '2025-06', month: '2025-06', Renta: 15000, Sueldos: 30000, Publicidad: 5000, Logística: 8000, Otros: 2000 }
  ]
};

// Helper function to generate IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Mock Firebase services
export const mockProductsService = {
  async addProduct(productData) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const newProduct = {
      id: generateId(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockDB.products.push(newProduct);
    return newProduct.id;
  },

  async getProducts() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockDB.products];
  },

  async updateProduct(productId, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockDB.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      mockDB.products[index] = {
        ...mockDB.products[index],
        ...updateData,
        updatedAt: new Date()
      };
    }
  },

  async deleteProduct(productId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockDB.products = mockDB.products.filter(p => p.id !== productId);
  }
};

export const mockClientsService = {
  async addClient(clientData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newClient = {
      id: generateId(),
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockDB.clients.push(newClient);
    return newClient.id;
  },

  async getClients() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockDB.clients];
  },

  async updateClient(clientId, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockDB.clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      mockDB.clients[index] = {
        ...mockDB.clients[index],
        ...updateData,
        updatedAt: new Date()
      };
    }
  },

  async deleteClient(clientId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockDB.clients = mockDB.clients.filter(c => c.id !== clientId);
  }
};

export const mockSalesService = {
  async addSale(saleData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newSale = {
      id: generateId(),
      ...saleData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockDB.sales.push(newSale);
    return newSale.id;
  },

  async getSales(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filteredSales = [...mockDB.sales];
    
    if (filters.month) {
      const startDate = new Date(filters.month + '-01');
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      filteredSales = filteredSales.filter(sale => {
        const saleDate = sale.date;
        return saleDate >= startDate && saleDate <= endDate;
      });
    }
    
    if (filters.clientId) {
      filteredSales = filteredSales.filter(sale => sale.clientId === filters.clientId);
    }
    
    return filteredSales.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async updateSale(saleId, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockDB.sales.findIndex(s => s.id === saleId);
    if (index !== -1) {
      mockDB.sales[index] = {
        ...mockDB.sales[index],
        ...updateData,
        updatedAt: new Date()
      };
    }
  },

  async deleteSale(saleId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockDB.sales = mockDB.sales.filter(s => s.id !== saleId);
  }
};

export const mockPricingService = {
  async setPricing(clientId, productId, price) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const pricingId = `${clientId}_${productId}`;
    const index = mockDB.pricing.findIndex(p => p.id === pricingId);
    
    if (index !== -1) {
      mockDB.pricing[index] = {
        ...mockDB.pricing[index],
        price,
        updatedAt: new Date()
      };
    } else {
      mockDB.pricing.push({
        id: pricingId,
        clientId,
        productId,
        price,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  },

  async getPricing() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockDB.pricing];
  }
};

export const mockExpensesService = {
  async setExpenses(month, expensesData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockDB.expenses.findIndex(e => e.month === month);
    
    if (index !== -1) {
      mockDB.expenses[index] = {
        ...mockDB.expenses[index],
        ...expensesData,
        updatedAt: new Date()
      };
    } else {
      mockDB.expenses.push({
        id: month,
        month,
        ...expensesData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  },

  async getExpenses(month) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDB.expenses.find(e => e.month === month) || null;
  },

  async getAllExpenses() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockDB.expenses];
  }
};

export const mockCheckIfDataExists = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockDB.products.length > 0;
};

export const mockSeedInitialData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Data is already seeded in mockDB
  return true;
};