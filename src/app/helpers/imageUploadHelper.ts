import { Request } from 'express'

export const handleImageUpload = (req: Request): string | null => {
  if (!req.file) {
    return null
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  return imageUrl
}
