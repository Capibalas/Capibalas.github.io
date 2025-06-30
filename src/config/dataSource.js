// Configuration to switch between mock data and Firebase
// Set USE_FIREBASE to true when Firebase is properly configured

export const USE_FIREBASE = true; // Firebase is working and connected successfully

// Firebase services
import { 
  productsService as firebaseProductsService, 
  clientsService as firebaseClientsService, 
  salesService as firebaseSalesService, 
  pricingService as firebasePricingService, 
  expensesService as firebaseExpensesService 
} from '../firebase/services';
import { seedInitialData as firebaseSeedInitialData, checkIfDataExists as firebaseCheckIfDataExists } from '../utils/seedData';

// Mock services
import { 
  mockProductsService, 
  mockClientsService, 
  mockSalesService, 
  mockPricingService, 
  mockExpensesService,
  mockSeedInitialData,
  mockCheckIfDataExists
} from '../utils/mockData';

// Export the appropriate services based on configuration
export const productsService = USE_FIREBASE ? firebaseProductsService : mockProductsService;
export const clientsService = USE_FIREBASE ? firebaseClientsService : mockClientsService;
export const salesService = USE_FIREBASE ? firebaseSalesService : mockSalesService;
export const pricingService = USE_FIREBASE ? firebasePricingService : mockPricingService;
export const expensesService = USE_FIREBASE ? firebaseExpensesService : mockExpensesService;
export const seedInitialData = USE_FIREBASE ? firebaseSeedInitialData : mockSeedInitialData;
export const checkIfDataExists = USE_FIREBASE ? firebaseCheckIfDataExists : mockCheckIfDataExists;