import { v2 as cloudinary } from 'cloudinary'

cloudinary.config() // automatically uses CLOUDINARY_URL env var

export default cloudinary
