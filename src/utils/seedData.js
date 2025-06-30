import { productsService, clientsService, salesService, pricingService, expensesService } from '../firebase/services.js';

// Global flag to prevent concurrent seeding
let isSeeding = false;

export const seedInitialData = async () => {
  // Prevent concurrent seeding
  if (isSeeding) {
    console.log('Seeding already in progress, skipping...');
    return true;
  }
  
  isSeeding = true;
  try {
    console.log('Starting data seeding...');

    // Check if data already exists to prevent duplicate seeding
    const existingData = await checkIfDataExists();
    if (existingData) {
      console.log('Data already exists, skipping seeding');
      return true;
    }

    // Seed Products
    const products = [
      {
        name: "Cápsulas Caja x10",
        title: "Cápsulas Caja x10",
        costoMXN: 83.25,
        price: 83.25,
        stockInicial: 2400,
        stock: 2400,
        minOrder: 1,
        category: "capsulas",
        description: "Cápsulas de N2O para sifones, caja de 10 unidades"
      },
      {
        name: "Cápsulas Caja x24",
        title: "Cápsulas Caja x24",
        costoMXN: 181.30,
        price: 181.30,
        stockInicial: 1000,
        stock: 1000,
        minOrder: 1,
        category: "capsulas",
        description: "Cápsulas de N2O para sifones, caja de 24 unidades"
      },
      {
        name: "Sifón Inox 0.5L",
        title: "Sifón Inox 0.5L",
        costoMXN: 462.50,
        price: 462.50,
        stockInicial: 100,
        stock: 100,
        minOrder: 1,
        category: "sifones",
        description: "Sifón de acero inoxidable de 0.5 litros"
      },
      {
        name: "Sifón Inox 1.0L",
        title: "Sifón Inox 1.0L",
        costoMXN: 650.00,
        price: 650.00,
        stockInicial: 50,
        stock: 50,
        minOrder: 1,
        category: "sifones",
        description: "Sifón de acero inoxidable de 1.0 litro"
      }
    ];

    const productIds = [];
    for (const product of products) {
      try {
        const id = await productsService.addProduct(product);
        productIds.push(id);
        console.log(`Added product: ${product.name}`);
      } catch (error) {
        console.warn(`Product ${product.name} may already exist:`, error.message);
        // Try to get existing products and find this one
        const existingProducts = await productsService.getProducts();
        const existingProduct = existingProducts.find(p => p.name === product.name);
        if (existingProduct) {
          productIds.push(existingProduct.id);
          console.log(`Using existing product: ${product.name}`);
        }
      }
    }

    // Seed Clients
    const clients = [
      { name: "PROESA", email: "compras@proesa.com", phone: "+52 55 1234-5678" },
      { name: "Café Etrusca", email: "pedidos@etrusca.mx", phone: "+52 55 2345-6789" },
      { name: "Venta en Línea", email: "online@bestwhipmx.com", phone: "+52 55 3456-7890" },
      { name: "CHEFMART", email: "ventas@chefmart.mx", phone: "+52 55 4567-8901" }
    ];

    const clientIds = [];
    for (const client of clients) {
      try {
        const id = await clientsService.addClient(client);
        clientIds.push(id);
        console.log(`Added client: ${client.name}`);
      } catch (error) {
        console.warn(`Client ${client.name} may already exist:`, error.message);
        // Try to get existing clients and find this one
        const existingClients = await clientsService.getClients();
        const existingClient = existingClients.find(c => c.name === client.name);
        if (existingClient) {
          clientIds.push(existingClient.id);
          console.log(`Using existing client: ${client.name}`);
        }
      }
    }

    // Seed Pricing
    const pricing = {
      [clientIds[0]]: { [productIds[0]]: 135.00, [productIds[1]]: 290.00, [productIds[2]]: 840.00, [productIds[3]]: 1150.00 }, // PROESA
      [clientIds[1]]: { [productIds[0]]: 138.50, [productIds[1]]: 295.00, [productIds[2]]: 850.00, [productIds[3]]: 1180.00 }, // Café Etrusca
      [clientIds[2]]: { [productIds[0]]: 150.00, [productIds[1]]: 320.00, [productIds[2]]: 950.00, [productIds[3]]: 1300.00 }, // Venta en Línea
      [clientIds[3]]: { [productIds[0]]: 140.00, [productIds[1]]: 300.00, [productIds[2]]: 860.00, [productIds[3]]: 1200.00 }  // CHEFMART
    };

    for (const [clientId, products] of Object.entries(pricing)) {
      for (const [productId, price] of Object.entries(products)) {
        try {
          await pricingService.setPricing(clientId, productId, price);
        } catch (error) {
          console.warn(`Pricing may already exist for client ${clientId}, product ${productId}:`, error.message);
        }
      }
    }
    console.log('Added pricing data');

    // Seed Sample Sales
    const salesData = [
      // April 2025
      { date: new Date('2025-04-05'), clientId: clientIds[0], productId: productIds[0], quantity: 150, channel: "Mayoreo" },
      { date: new Date('2025-04-10'), clientId: clientIds[2], productId: productIds[1], quantity: 70, channel: "En línea" },
      { date: new Date('2025-04-15'), clientId: clientIds[1], productId: productIds[2], quantity: 10, channel: "Mayoreo" },
      { date: new Date('2025-04-20'), clientId: clientIds[3], productId: productIds[0], quantity: 200, channel: "Mayoreo" },
      
      // May 2025
      { date: new Date('2025-05-03'), clientId: clientIds[0], productId: productIds[0], quantity: 250, channel: "Mayoreo" },
      { date: new Date('2025-05-08'), clientId: clientIds[2], productId: productIds[1], quantity: 120, channel: "En línea" },
      { date: new Date('2025-05-12'), clientId: clientIds[1], productId: productIds[2], quantity: 15, channel: "Mayoreo" },
      { date: new Date('2025-05-18'), clientId: clientIds[3], productId: productIds[3], quantity: 8, channel: "Mayoreo" },
      { date: new Date('2025-05-25'), clientId: clientIds[0], productId: productIds[1], quantity: 100, channel: "Mayoreo" },
      
      // June 2025
      { date: new Date('2025-06-02'), clientId: clientIds[0], productId: productIds[0], quantity: 300, channel: "Mayoreo" },
      { date: new Date('2025-06-07'), clientId: clientIds[2], productId: productIds[1], quantity: 150, channel: "En línea" },
      { date: new Date('2025-06-11'), clientId: clientIds[1], productId: productIds[2], quantity: 25, channel: "Mayoreo" },
      { date: new Date('2025-06-16'), clientId: clientIds[3], productId: productIds[0], quantity: 180, channel: "Mayoreo" },
      { date: new Date('2025-06-20'), clientId: clientIds[1], productId: productIds[3], quantity: 12, channel: "Mayoreo" },
      { date: new Date('2025-06-25'), clientId: clientIds[2], productId: productIds[0], quantity: 80, channel: "En línea" }
    ];

    for (const sale of salesData) {
      try {
        await salesService.addSale(sale);
      } catch (error) {
        console.warn(`Sale may already exist:`, error.message);
      }
    }
    console.log('Added sample sales data');

    // Seed Expenses
    const expensesData = {
      "2025-04": { "Renta": 14000, "Sueldos": 28000, "Publicidad": 4500, "Logística": 7000, "Otros": 1800 },
      "2025-05": { "Renta": 14500, "Sueldos": 29000, "Publicidad": 5500, "Logística": 7500, "Otros": 2100 },
      "2025-06": { "Renta": 15000, "Sueldos": 30000, "Publicidad": 5000, "Logística": 8000, "Otros": 2000 }
    };

    for (const [month, expenses] of Object.entries(expensesData)) {
      try {
        await expensesService.setExpenses(month, expenses);
      } catch (error) {
        console.warn(`Expenses may already exist for month ${month}:`, error.message);
      }
    }
    console.log('Added expenses data');

    console.log('Data seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    isSeeding = false;
  }
};

export const checkIfDataExists = async () => {
  try {
    console.log('Checking if data exists...');
    const [products, clients, sales] = await Promise.all([
      productsService.getProducts(),
      clientsService.getClients(),
      salesService.getSales()
    ]);
    
    const hasData = products.length > 0 && clients.length > 0 && sales.length > 0;
    console.log(`Data exists: ${hasData} (Products: ${products.length}, Clients: ${clients.length}, Sales: ${sales.length})`);
    
    return hasData;
  } catch (error) {
    console.error('Error checking data:', error);
    return false;
  }
};