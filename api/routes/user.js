const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')

// Controller
const UserController = require('../controllers/users')

// Get all users
router.get('/', UserController.users_get_all)

// Register user
router.post('/signup', UserController.users_signup)

// Login in users
router.post('/signin', UserController.users_signin)

// Delete User
router.delete('/:userId', checkAuth, UserController.users_delete_user)

module.exports = router