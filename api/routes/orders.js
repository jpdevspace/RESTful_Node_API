const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')

// Controllers
const OrdersControllers = require('../controllers/orders')

// Display all orders
router.get('/', checkAuth, OrdersControllers.orders_get_all)

// Create new orders
router.post('/', checkAuth, OrdersControllers.orders_create_order)

// Get details on a specific order
router.get('/:orderId', checkAuth, OrdersControllers.orders_get_order)

// Remove an order
router.delete('/:orderId', checkAuth, OrdersControllers.order_delete_order)

module.exports = router;