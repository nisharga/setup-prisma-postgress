import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs' 
import config from '../../config'

export const sendImageToCloudinary = (imageName: string, path: string) => {
  cloudinary.config({
    cloud_name: config.cloud_env.cloud_name as string,
    api_key: config.cloud_env.api_key as string,
    api_secret: config.cloud_env.api_secret as string,
  })
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName },
      function (error, result) {
        if (error) {
          reject(error)
        } else resolve(result)
        fs.unlink(path, error => {
          if (error) {
            console.error('Failed to delete file:', error)
          } else {
            console.log('The file was successfully deleted.')
          }
        })
      },
    )
  })
}

export interface CloudinaryResponse {
    secure_url: string
}
  