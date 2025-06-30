import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config.js';

// Helper function to generate unique filename
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
};

// Helper function to validate image file
const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y WebP.');
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es demasiado grande. El tamaño máximo es 5MB.');
  }

  return true;
};

export const storageService = {
  // Upload product image
  async uploadProductImage(file, productId = null) {
    try {
      validateImageFile(file);
      
      const filename = generateUniqueFilename(file.name);
      const folder = productId ? `products/${productId}` : 'temp';
      const storageRef = ref(storage, `${folder}/${filename}`);
      
      console.log(`Subiendo imagen a: ${folder}/${filename}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('Imagen subida exitosamente:', downloadURL);
      
      return {
        url: downloadURL,
        path: snapshot.ref.fullPath,
        filename: filename
      };
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  },

  // Upload general file
  async uploadFile(file, folder = 'uploads') {
    try {
      const filename = generateUniqueFilename(file.name);
      const storageRef = ref(storage, `${folder}/${filename}`);
      
      console.log(`Subiendo archivo a: ${folder}/${filename}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('Archivo subido exitosamente:', downloadURL);
      
      return {
        url: downloadURL,
        path: snapshot.ref.fullPath,
        filename: filename
      };
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw new Error(`Error al subir archivo: ${error.message}`);
    }
  },

  // Delete file by path
  async deleteFile(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      console.log('Archivo eliminado exitosamente:', filePath);
      return true;
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      throw new Error(`Error al eliminar archivo: ${error.message}`);
    }
  },

  // Move file from temp to permanent location
  async moveFromTemp(tempPath, newFolder) {
    try {
      // Get the file from temp location
      const tempRef = ref(storage, tempPath);
      const downloadURL = await getDownloadURL(tempRef);
      
      // Create new reference
      const filename = tempPath.split('/').pop();
      const newRef = ref(storage, `${newFolder}/${filename}`);
      
      // Download and re-upload (Firebase doesn't have native move)
      const response = await fetch(downloadURL);
      const blob = await response.blob();
      
      const snapshot = await uploadBytes(newRef, blob);
      const newDownloadURL = await getDownloadURL(snapshot.ref);
      
      // Delete temp file
      await deleteObject(tempRef);
      
      return {
        url: newDownloadURL,
        path: snapshot.ref.fullPath,
        filename: filename
      };
    } catch (error) {
      console.error('Error moviendo archivo:', error);
      throw new Error(`Error al mover archivo: ${error.message}`);
    }
  },

  // Get file URL by path
  async getFileURL(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error('Error obteniendo URL del archivo:', error);
      throw new Error(`Error al obtener URL del archivo: ${error.message}`);
    }
  }
};

export default storageService;