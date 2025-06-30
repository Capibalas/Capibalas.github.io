import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { seedInitialData } from './seedData.js';

// Function to clear all existing data and reseed with correct structure
export const reseedData = async () => {
  try {
    console.log('Starting data reseed...');
    
    // Clear existing data
    const collections = ['products', 'clients', 'sales', 'pricing', 'expenses'];
    
    for (const collectionName of collections) {
      console.log(`Clearing ${collectionName}...`);
      const querySnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = querySnapshot.docs.map(document => 
        deleteDoc(doc(db, collectionName, document.id))
      );
      await Promise.all(deletePromises);
      console.log(`Cleared ${querySnapshot.docs.length} documents from ${collectionName}`);
    }
    
    console.log('All data cleared. Starting reseed...');
    
    // Reseed with new structure
    await seedInitialData();
    
    console.log('Data reseed completed successfully!');
    return true;
  } catch (error) {
    console.error('Error during reseed:', error);
    throw error;
  }
};