const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Express Static Folder
// the see the files in the browser, go to localhost:3000/uploads/<filename>
// if I remove '/uploads', then I have to use localhost:3000/<filename>
app.use('/uploads', express.static('uploads')) 

// Importing routes
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

// Mongoose
  // Connecting to MongoDB ATLAS
mongoose.connect(`mongodb+srv://jpdbuser:${process.env.MONGO_ATLAS_PSWD}@node-rest-shop-oxsa2.mongodb.net/test?retryWrites=true`)
  // Check for errors
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connected to DB'))
mongoose.Promise = global.Promise

// Middleware
  // Morgan
app.use(morgan('dev'))
  // BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
  // CORS (WITHOUT npm package)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Header', 
  'Origin, X-Requested-With, Content-Type, Accept, Authorization')

if (req.method === 'OPTIONS') {
  res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
  return res.status(200).json({})
}

next()
})
// Using routes
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/users', userRoutes)

// Creating an error if no route was found
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app