import fs from 'fs'
import multer from 'multer'
import path from 'path'
import uniqid from 'uniqid'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const filename = uniqid() + path.extname(file.originalname)
    cb(null, filename)
  },
})

// File filter to ensure only images are uploaded
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png/
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  )
  const mimetype = allowedTypes.test(file.mimetype)
  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(new Error('Only image files (jpeg, jpg, png) are allowed!'))
  }
}

const upload = multer({ storage, fileFilter })

export default upload
