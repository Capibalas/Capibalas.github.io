import { reseedData } from './reseedData.js';

// Simple script to run the reseed operation
const runReseed = async () => {
  try {
    console.log('Starting reseed operation...');
    await reseedData();
    console.log('Reseed completed successfully!');
  } catch (error) {
    console.error('Reseed failed:', error);
  }
};

// Export for use in console or other scripts
export { runReseed };

// If running directly in browser console, you can call:
// window.runReseed = runReseed;
if (typeof window !== 'undefined') {
  window.runReseed = runReseed;
}