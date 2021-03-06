const mongoose = require('mongoose')

// Models
const Product = require('../models/product')

// Display all products
exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('name price productImage _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`
            }
          }
        })
      }
      console.log(response)
      res.status(200).json(response)
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error })
    })
}

// Creating new products
exports.products_create_product = (req, res, next) => {
  console.log(req.file);
  // Creating a new product instance
  const product = new Product({
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })

  // Save product in DB
  product.save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product created succesfully!',
        createdProduct: {
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          _id: result.id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`
          }
        }
      })
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error })
    })
}

// Get details for a specific product
exports.products_get_product = (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select('name price productImage _id')
    .exec()
    .then(doc => {
      console.log(doc)
      // If a doc is found
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: 'http://localhost/products'
          }
        })

      } else { // If a doc is NOT found (but no errors are thrown)
        res.status(404).json({ message: 'No valid entry found' })
      }
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error })
    })
}

// Update the name or price of a product
exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {}
  // Iterating through the req.params object to check what params are available
    // If there is a property in the req.params obj, create the same key: value pair and add it to the updateOps obs
  for (let ops of req.body) {
    updateOps[ops.propName] = ops.value
    console.log(`key: ${updateOps[ops]} value:${ops.value}`)
    console.log(req.body);
  }

  Product.findByIdAndUpdate(id, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json(result)
    })
    .catch(error => {
      console.error(error)
      res.status(500).json(error)
    })
}

// Remove a product from the db
exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndRemove(id)
    .exec()
    .then(result => {
      res.status(200).json(
        {
          message: 'Item deleted from DB'
        }
      )
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error })
    })
}