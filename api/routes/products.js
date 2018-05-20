const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const MulterUpload = require('../middleware/multer-upload')

// Controllers
const ProductsController = require('../controllers/products')

// Display all products
router.get('/', ProductsController.products_get_all)

// Creating new products
router.post('/', checkAuth, MulterUpload.m_upload.single('productImage'), ProductsController.products_create_product)

// Get details for a specific product
router.get('/:productId', ProductsController.products_get_product)

// Update the name or price of a product
router.patch('/:productId', checkAuth, ProductsController.products_update_product)

// Remove a product from the db
router.delete('/:productId', checkAuth, ProductsController.products_delete_product)

module.exports = router;