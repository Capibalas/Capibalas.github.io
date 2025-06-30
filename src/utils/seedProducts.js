import { productsService } from '../firebase/services.js'

const sampleProducts = [
  {
    id: 'sifon-profesional-05l',
    title: "Sifón Profesional 0.5L",
    description: "Sifón de aluminio anodizado con válvula de precisión para resultados perfectos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
    imagePath: "temp/sifon-profesional-05l.jpg",
    category: "sifones",
    price: 850,
    stock: 25,
    minOrder: 1,
    specifications: {
      capacity: "0.5L",
      material: "Aluminio anodizado",
      weight: "1.2kg",
      warranty: "2 años"
    },
    features: [
      "Válvula de precisión",
      "Diseño ergonómico",
      "Fácil limpieza",
      "Resistente a la corrosión"
    ]
  },
  {
    id: 'sifon-premium-1l',
    title: "Sifón Premium 1L",
    description: "Máxima capacidad para uso comercial con acabados de alta calidad",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
    imagePath: "temp/sifon-premium-1l.jpg",
    category: "sifones",
    price: 1200,
    stock: 15,
    minOrder: 1,
    specifications: {
      capacity: "1L",
      material: "Acero inoxidable",
      weight: "1.8kg",
      warranty: "3 años"
    },
    features: [
      "Capacidad comercial",
      "Acabado premium",
      "Válvula de alta precisión",
      "Diseño profesional"
    ]
  },
  {
    id: 'capsulas-n2o-premium',
    title: "Cápsulas N2O Premium",
    description: "Cápsulas de óxido nitroso de alta pureza para resultados profesionales",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center",
    category: "capsulas",
    price: 18,
    stock: 500,
    minOrder: 10,
    specifications: {
      purity: "99.9%",
      volume: "8g",
      compatibility: "Universal",
      certification: "ISO 9001"
    },
    features: [
      "Alta pureza",
      "Compatibilidad universal",
      "Certificación ISO",
      "Resultados consistentes"
    ]
  },
  {
    id: 'sifon-mini-025l',
    title: "Sifón Mini 0.25L",
    description: "Perfecto para uso doméstico y porciones pequeñas",
    image: "https://images.unsplash.com/photo-1556909114-4f5e4d1e5b4e?w=400&h=400&fit=crop&crop=center",
    category: "sifones",
    price: 550,
    stock: 30,
    minOrder: 1,
    specifications: {
      capacity: "0.25L",
      material: "Aluminio",
      weight: "0.8kg",
      warranty: "1 año"
    },
    features: [
      "Tamaño compacto",
      "Ideal para casa",
      "Fácil manejo",
      "Precio accesible"
    ]
  },
  {
    id: 'capsulas-n2o-standard',
    title: "Cápsulas N2O Standard",
    description: "Cápsulas de calidad estándar para uso regular",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center",
    category: "capsulas",
    price: 14,
    stock: 750,
    minOrder: 20,
    specifications: {
      purity: "99.5%",
      volume: "8g",
      compatibility: "Universal",
      certification: "CE"
    },
    features: [
      "Calidad estándar",
      "Precio competitivo",
      "Disponibilidad alta",
      "Uso regular"
    ]
  },
  {
    id: 'kit-completo-profesional',
    title: "Kit Completo Profesional",
    description: "Todo lo que necesitas para empezar: sifón + cápsulas + accesorios",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
    category: "kits",
    price: 1400,
    stock: 10,
    minOrder: 1,
    specifications: {
      includes: "Sifón 0.5L + 50 cápsulas + accesorios",
      material: "Aluminio anodizado",
      warranty: "2 años",
      value: "Ahorro del 15%"
    },
    features: [
      "Kit completo",
      "Ahorro significativo",
      "Ideal para iniciar",
      "Incluye accesorios"
    ]
  },
  {
    id: 'dispensador-crema-500ml',
    title: "Dispensador de Crema 500ml",
    description: "Dispensador especializado para cremas y mousses",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
    category: "sifones",
    price: 950,
    stock: 20,
    minOrder: 1,
    specifications: {
      capacity: "500ml",
      material: "Acero inoxidable",
      weight: "1.5kg",
      warranty: "2 años"
    },
    features: [
      "Especializado en cremas",
      "Control de textura",
      "Fácil dispensado",
      "Limpieza sencilla"
    ]
  },
  {
    id: 'capsulas-n2o-eco',
    title: "Cápsulas N2O Eco",
    description: "Cápsulas ecológicas con embalaje reciclable",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=400&fit=crop&crop=center",
    category: "capsulas",
    price: 16,
    stock: 300,
    minOrder: 15,
    specifications: {
      purity: "99.7%",
      volume: "8g",
      packaging: "100% reciclable",
      certification: "Eco-friendly"
    },
    features: [
      "Embalaje ecológico",
      "Certificación ambiental",
      "Alta pureza",
      "Responsabilidad social"
    ]
  }
]

export const seedProducts = async () => {
  try {
    console.log('Iniciando población de productos...')
    
    for (const product of sampleProducts) {
      try {
        // Verificar si el producto ya existe
        const existingProducts = await productsService.getAll()
        const exists = existingProducts.some(p => p.id === product.id)
        
        if (!exists) {
          await productsService.create(product)
          console.log(`✅ Producto creado: ${product.title}`)
        } else {
          console.log(`⚠️ Producto ya existe: ${product.title}`)
        }
      } catch (error) {
        console.error(`❌ Error creando producto ${product.title}:`, error)
      }
    }
    
    console.log('✅ Población de productos completada')
    return true
  } catch (error) {
    console.error('❌ Error en población de productos:', error)
    return false
  }
}

export default seedProducts