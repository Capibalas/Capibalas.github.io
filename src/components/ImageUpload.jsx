import { useState, useRef } from 'react';
import { storageService } from '../firebase/storageService';

const ImageUpload = ({ onImageUploaded, currentImage = null, productId = null, className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload to Firebase Storage
      const result = await storageService.uploadProductImage(file, productId);
      
      // Call callback with the result
      if (onImageUploaded) {
        onImageUploaded(result);
      }

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      setPreview(result.url);

    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message);
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (onImageUploaded) {
      onImageUploaded(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        
        <label
          htmlFor="image-upload"
          className={`
            block w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors duration-200
            ${uploading 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }
          `}
        >
          {uploading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Subiendo imagen...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl">📷</div>
              <div className="text-gray-600">
                <span className="font-medium text-blue-600">Haz clic para subir</span> o arrastra una imagen aquí
              </div>
              <div className="text-sm text-gray-500">
                PNG, JPG, WebP hasta 5MB
              </div>
            </div>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  Imagen del producto
                </div>
                <div className="text-sm text-gray-500">
                  {uploading ? 'Subiendo...' : 'Imagen cargada exitosamente'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={uploading}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                title="Eliminar imagen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;