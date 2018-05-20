const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

router.get('/', (req, res, next) => {
  User.find()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(error => res.status(500).json({ error }))
})

// Register user
router.post('/signup', (req, res, next) => {
  // 1. Check if user exists and it's already in the db
  User.find({ email: req.body.email })
    .then(existingUser => {
      if(existingUser.length >= 1) { // If user already exists
        console.log(existingUser);
        return res.status(409).json({ message: 'Email is already being used' })
      } else { // If user does not exist, create it
        bcrypt.hash(req.body.password, 12, (err, hash) => {
          if (err) {
            return res.status(500).json({ err })
          } else { 
            const user = new User({
              _id: new mongoose.Types.ObjectId,
              email: req.body.email,
              password: hash
            })
            user.save()
            .then(result => {
              console.log(result);
              res.status(201).json({ message: 'User created succesfully!' })
            })
            .catch(error => {
              console.error(error)
              res.status(500).json({ error })
            })
          }
        })
      }
    })
})

// Delete users
router.delete('/:userId', (req, res, next) => {
  User.findByIdAndRemove(req.params.userId)
    .then(result => res.status(200).json({ message: 'User deleted' }))
    .catch(error => {
      console.error(error)
      res.status(500).json({ error })
    })
})

// Login in users
router.post('/signin', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
    
      if (!user) {
        return res.status(401).json({ message: 'Auth failed' })
      }
      // Compare the password typed in vs the password in database
      bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (error) {
          return res.status(401).json({ message: 'Auth failed' })
        }
        // If the user is found and the password match  
        if (result) {
          // Sign the token
          const token = jwt.sign({
            email: user.email,
            userId: user._id
          }, 
          process.env.JWT_KEY,
          {
            expiresIn: '1h'
          } 
        )
          // Send the response
          return res.status(200).json({ 
            message: 'Auth succesful', 
            token
          })
        }

        return res.status(401).json({ message: 'Auth failed' })
      })

    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error })
    })
})

module.exports = router