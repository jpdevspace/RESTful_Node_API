const multer = require('multer')

// Multer config
const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()} ${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  // Accept the file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    // Reject a file
    cb(null, false)
  }
}

const upload = multer({ 
  storage, 
  limits: {
    fileSize: 1024 * 1024 * 5 // Only accept files of 5 mb max
  },
  fileFilter,
})

exports.m_upload = upload