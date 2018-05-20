const mongoose = require('mongoose')

// Models
const Order = require('../models/order')
const Product = require('../models/product')

// Display all orders
exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .then(result => {
      res.status(200).json({
        count: result.length,
        order: result.map(doc => {
          return {
            id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${doc._id}`
            }
          }
        })
      })
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error })
    })
}

// Create new orders
exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      console.log(req.body.productId);
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId,
        quantity: req.body.quantity,
        product: req.body.productId
      })
    
      order
        .save()
        .then(result => {
          console.log(result)
          res.status(201).json({
            message: 'Order stored',
            createdOrder: {
              _id: result._id,
              product: result.product,
              quantity: result.quantity
            },
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${result._id}`
            }
          })
        })
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ 
        message: 'Product not found',
        error 
      })
    })
}

// Get details on a specific order
exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }

      res.status(200).json({
        order,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders`
        }
      })
    })
    .catch(error => {
      res.status(500).json({ error })
    })
} 

// Delete order
exports.order_delete_order = (req, res, next) => {
  Order.findByIdAndRemove(req.params.orderId)
    .then(result => {
      res.status(200).json({
        message: 'Order deleted'
      })
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error })
    })
}