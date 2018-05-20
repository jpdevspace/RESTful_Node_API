const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    // Add wether the user is verified or not to userData so it is readily available 
    req.userData = decoded
    next()
  } catch(error) {
    return res.status(401).json({ message: 'Auth Failed' })
  }

}