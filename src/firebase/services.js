import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { db, checkFirebaseConnection } from './config.js';

// Helper function to handle Firebase errors
const handleFirebaseError = (error, operation) => {
  console.error(`Firebase ${operation} error:`, error);
  
  if (error.code === 'permission-denied') {
    throw new Error('No tienes permisos para realizar esta operación. Verifica las reglas de Firestore.');
  } else if (error.code === 'unavailable') {
    throw new Error('Firebase no está disponible. Verifica tu conexión a internet.');
  } else if (error.code === 'not-found') {
    throw new Error('El documento solicitado no existe.');
  } else if (error.message && error.message.includes('Target ID already exists')) {
    // Handle duplicate document errors more gracefully
    console.warn(`Duplicate document detected in ${operation}, continuing...`);
    return; // Don't throw error for duplicates
  } else {
    throw new Error(`Error en ${operation}: ${error.message}`);
  }
};

// Check connection before operations with retry logic
const ensureConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const isConnected = await checkFirebaseConnection();
      if (isConnected) {
        return true;
      }
    } catch (error) {
      console.warn(`Connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        throw new Error('No se puede conectar a Firebase después de varios intentos.');
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
};

// Add delay between operations to prevent concurrent write issues
const addOperationDelay = () => new Promise(resolve => setTimeout(resolve, 100));

// Products service
export const productsService = {
  // Add a new product
  async addProduct(productData) {
    try {
      await ensureConnection();
      await addOperationDelay();
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      handleFirebaseError(error, 'agregar producto');
    }
  },

  // Create a new product (alias for addProduct for consistency)
  async create(productData) {
    return this.addProduct(productData);
  },

  // Get all products (alias for getProducts for consistency)
  async getAll() {
    return this.getProducts();
  },

  // Get all products
  async getProducts() {
    try {
      await ensureConnection();
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      if (error.message && error.message.includes('Target ID already exists')) {
        console.warn('Duplicate document detected while getting products, retrying...');
        // Wait a bit and retry
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
          const querySnapshot = await getDocs(collection(db, 'products'));
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          return []; // Return empty array instead of throwing
        }
      }
      handleFirebaseError(error, 'obtener productos');
      return []; // Return empty array if error handling doesn't throw
    }
  },

  // Update product
  async updateProduct(productId, updateData) {
    try {
      await ensureConnection();
      const productRef = doc(db, 'products', productId);
      
      // Check if document exists before updating
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error(`El producto con ID ${productId} no existe en la base de datos.`);
      }
      
      await updateDoc(productRef, {
        ...updateData,
        updatedAt: new Date()
      });
    } catch (error) {
      handleFirebaseError(error, 'actualizar producto');
    }
  },

  // Delete product
  async deleteProduct(productId) {
    try {
      await ensureConnection();
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirebaseError(error, 'eliminar producto');
    }
  }
};

// Clients service
export const clientsService = {
  // Add a new client
  async addClient(clientData) {
    try {
      await ensureConnection();
      await addOperationDelay();
      const docRef = await addDoc(collection(db, 'clients'), {
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      handleFirebaseError(error, 'agregar cliente');
    }
  },

  // Get all clients
  async getClients() {
    try {
      await ensureConnection();
      const querySnapshot = await getDocs(collection(db, 'clients'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      if (error.message && error.message.includes('Target ID already exists')) {
        console.warn('Duplicate document detected while getting clients, retrying...');
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
          const querySnapshot = await getDocs(collection(db, 'clients'));
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          return [];
        }
      }
      handleFirebaseError(error, 'obtener clientes');
      return [];
    }
  },

  // Update client
  async updateClient(clientId, updateData) {
    try {
      await ensureConnection();
      const clientRef = doc(db, 'clients', clientId);
      await updateDoc(clientRef, {
        ...updateData,
        updatedAt: new Date()
      });
    } catch (error) {
      handleFirebaseError(error, 'actualizar cliente');
    }
  },

  // Delete client
  async deleteClient(clientId) {
    try {
      await ensureConnection();
      await deleteDoc(doc(db, 'clients', clientId));
    } catch (error) {
      handleFirebaseError(error, 'eliminar cliente');
    }
  }
};

// Sales service
export const salesService = {
  // Add a new sale
  async addSale(saleData) {
    try {
      await ensureConnection();
      await addOperationDelay();
      const docRef = await addDoc(collection(db, 'sales'), {
        ...saleData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      handleFirebaseError(error, 'agregar venta');
    }
  },

  // Get sales with optional filters
  async getSales(filters = {}) {
    try {
      await ensureConnection();
      let q = collection(db, 'sales');
      
      // For now, get all sales and filter in memory to avoid index issues
      const querySnapshot = await getDocs(q);
      let sales = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by month if specified
      if (filters.month) {
        const startDate = new Date(filters.month + '-01');
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        sales = sales.filter(sale => {
          const saleDate = sale.date.toDate ? sale.date.toDate() : new Date(sale.date);
          return saleDate >= startDate && saleDate <= endDate;
        });
      }
      
      // Filter by client if specified
      if (filters.clientId) {
        sales = sales.filter(sale => sale.clientId === filters.clientId);
      }
      
      // Sort by date descending
      sales.sort((a, b) => {
        const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
      });
      
      return sales;
    } catch (error) {
      if (error.message && error.message.includes('Target ID already exists')) {
        console.warn('Duplicate document detected while getting sales, retrying...');
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
          const querySnapshot = await getDocs(collection(db, 'sales'));
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          return [];
        }
      }
      handleFirebaseError(error, 'obtener ventas');
      return [];
    }
  },

  // Update sale
  async updateSale(saleId, updateData) {
    try {
      await ensureConnection();
      const saleRef = doc(db, 'sales', saleId);
      await updateDoc(saleRef, {
        ...updateData,
        updatedAt: new Date()
      });
    } catch (error) {
      handleFirebaseError(error, 'actualizar venta');
    }
  },

  // Delete sale
  async deleteSale(saleId) {
    try {
      await ensureConnection();
      await deleteDoc(doc(db, 'sales', saleId));
    } catch (error) {
      handleFirebaseError(error, 'eliminar venta');
    }
  }
};

// Pricing service
export const pricingService = {
  // Add or update pricing
  async setPricing(clientId, productId, price) {
    try {
      await ensureConnection();
      const pricingId = `${clientId}_${productId}`;
      const docRef = doc(db, 'pricing', pricingId);
      await setDoc(docRef, {
        clientId,
        productId,
        price,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      handleFirebaseError(error, 'configurar precios');
    }
  },

  // Get all pricing
  async getPricing() {
    try {
      await ensureConnection();
      const querySnapshot = await getDocs(collection(db, 'pricing'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      if (error.message && error.message.includes('Target ID already exists')) {
        console.warn('Duplicate document detected while getting pricing, retrying...');
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
          const querySnapshot = await getDocs(collection(db, 'pricing'));
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          return [];
        }
      }
      handleFirebaseError(error, 'obtener precios');
      return [];
    }
  }
};

// Expenses service
export const expensesService = {
  // Add or update expenses for a month
  async setExpenses(month, expensesData) {
    try {
      await ensureConnection();
      const docRef = doc(db, 'expenses', month);
      await setDoc(docRef, {
        ...expensesData,
        month,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      handleFirebaseError(error, 'configurar gastos');
    }
  },

  // Get expenses for a specific month
  async getExpenses(month) {
    try {
      await ensureConnection();
      const docRef = doc(db, 'expenses', month);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      handleFirebaseError(error, 'obtener gastos del mes');
    }
  },

  // Get all expenses
  async getAllExpenses() {
    try {
      await ensureConnection();
      const querySnapshot = await getDocs(collection(db, 'expenses'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      if (error.message && error.message.includes('Target ID already exists')) {
        console.warn('Duplicate document detected while getting expenses, retrying...');
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
          const querySnapshot = await getDocs(collection(db, 'expenses'));
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          return [];
        }
      }
      handleFirebaseError(error, 'obtener todos los gastos');
      return [];
    }
  }
};

// Real-time listeners
export const subscribeToCollection = (collectionName, callback) => {
  const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
  
  return unsubscribe;
};

// Orders service for B2B portal
export const ordersService = {
  // Add a new order
  async addOrder(orderData) {
    try {
      await ensureConnection();
      await addOperationDelay();
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: orderData.status || 'pending'
      });
      return docRef.id;
    } catch (error) {
      handleFirebaseError(error, 'agregar orden');
    }
  },

  // Get orders for a specific user
  async getUserOrders(userId) {
    try {
      await ensureConnection();
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.warn('Error getting user orders, falling back to all orders:', error);
      // Fallback: get all orders and filter client-side
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const allOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return allOrders.filter(order => order.userId === userId);
      } catch (fallbackError) {
        handleFirebaseError(fallbackError, 'obtener órdenes del usuario');
        return [];
      }
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      await ensureConnection();
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      handleFirebaseError(error, 'actualizar estado de orden');
    }
  },

  // Get order by ID
  async getOrder(orderId) {
    try {
      await ensureConnection();
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        return {
          id: orderSnap.id,
          ...orderSnap.data()
        };
      }
      return null;
    } catch (error) {
      handleFirebaseError(error, 'obtener orden');
    }
  }
};

// Invoices service for B2B portal
export const invoicesService = {
  // Add a new invoice
  async addInvoice(invoiceData) {
    try {
      await ensureConnection();
      await addOperationDelay();
      const docRef = await addDoc(collection(db, 'invoices'), {
        ...invoiceData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: invoiceData.status || 'pending'
      });
      return docRef.id;
    } catch (error) {
      handleFirebaseError(error, 'agregar factura');
    }
  },

  // Get invoices for a specific user
  async getUserInvoices(userId) {
    try {
      await ensureConnection();
      const q = query(
        collection(db, 'invoices'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.warn('Error getting user invoices, falling back to all invoices:', error);
      // Fallback: get all invoices and filter client-side
      try {
        const querySnapshot = await getDocs(collection(db, 'invoices'));
        const allInvoices = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return allInvoices.filter(invoice => invoice.userId === userId);
      } catch (fallbackError) {
        handleFirebaseError(fallbackError, 'obtener facturas del usuario');
        return [];
      }
    }
  },

  // Update invoice status
  async updateInvoiceStatus(invoiceId, status) {
    try {
      await ensureConnection();
      const invoiceRef = doc(db, 'invoices', invoiceId);
      await updateDoc(invoiceRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      handleFirebaseError(error, 'actualizar estado de factura');
    }
  }
};

// User profiles service for B2B portal
export const userProfilesService = {
  // Create or update user profile
  async setUserProfile(userId, profileData) {
    try {
      await ensureConnection();
      const docRef = doc(db, 'userProfiles', userId);
      await setDoc(docRef, {
        ...profileData,
        userId,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      handleFirebaseError(error, 'actualizar perfil de usuario');
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      await ensureConnection();
      const docRef = doc(db, 'userProfiles', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      handleFirebaseError(error, 'obtener perfil de usuario');
    }
  }
};

// Notifications service for B2B portal
export const notificationsService = {
  // Add a new notification
  async addNotification(notificationData) {
    try {
      await ensureConnection();
      await addOperationDelay();
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        createdAt: new Date(),
        read: false
      });
      return docRef.id;
    } catch (error) {
      handleFirebaseError(error, 'agregar notificación');
    }
  },

  // Get notifications for a specific user
  async getUserNotifications(userId) {
    try {
      await ensureConnection();
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.warn('Error getting user notifications, falling back to all notifications:', error);
      // Fallback: get all notifications and filter client-side
      try {
        const querySnapshot = await getDocs(collection(db, 'notifications'));
        const allNotifications = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return allNotifications.filter(notification => notification.userId === userId);
      } catch (fallbackError) {
        handleFirebaseError(fallbackError, 'obtener notificaciones del usuario');
        return [];
      }
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      await ensureConnection();
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date()
      });
    } catch (error) {
      handleFirebaseError(error, 'marcar notificación como leída');
    }
  }
};