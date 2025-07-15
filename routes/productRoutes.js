const express = require('express')
const router = express.Router()

const {
  getAllProducts,
  getProductByQuery,
  getProductsByCategories,
  getProductsByPrice,
  getProductByCode,
  createProduct,
  createManyProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

// Obtener todos los productos
router.get('/', getAllProducts)

// Buscar por categoria
router.get('/categoria/:nombre', getProductsByCategories)

// Buscar por nombre (query insensitive)
router.get('/buscar', getProductByQuery)

// Buscar por precio minimo y maximo
router.get('/precio/:min-:max', getProductsByPrice)

// Buscar por codigo
router.get('/:codigo', getProductByCode)

// Agregar un producto
router.post('/', createProduct)

// Agregar varios productos en simultaneo
router.post('/masivo', createManyProducts)

// Modificar un producto existente
router.put('/:codigo', updateProduct)

// Eliminar un producto existente
router.delete('/:codigo', deleteProduct)

module.exports = router