const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')

// Display all orders
router.get('/', (req, res, next) => {
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
})

// Create new orders
router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!doc) {
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
  
})

// Get details on a specific order
router.get('/:orderId', (req, res, next) => {
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
})

// Remove an order
router.delete('/:orderId', (req, res, next) => {
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
})

module.exports = router;