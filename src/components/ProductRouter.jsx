import { useAuth } from '../contexts/AuthContext';
import PublicProductCatalog from './PublicProductCatalog';
import EnhancedProductManager from './EnhancedProductManager';

const ProductRouter = () => {
  const { user } = useAuth();

  // Si el usuario está autenticado y es admin, mostrar el panel completo
  if (user && user.email === 'admin@bestwhip.com') {
    return <EnhancedProductManager />;
  }

  // Si el usuario está autenticado pero no es admin, mostrar catálogo con precios
  if (user) {
    return <PublicProductCatalog />;
  }

  // Si no está autenticado, mostrar catálogo sin precios
  return <PublicProductCatalog />;
};

export default ProductRouter;