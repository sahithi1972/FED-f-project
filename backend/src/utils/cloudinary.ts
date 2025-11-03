import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Determine whether Cloudinary is configured; if not, fall back to local storage
const CLOUDINARY_CONFIGURED = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export const uploadToCloudinary = async (filePath: string, folder: string): Promise<string> => {
  try {
    if (!CLOUDINARY_CONFIGURED) {
      // Ensure public uploads folder exists (backend/uploads/public)
      const publicDir = path.join(__dirname, '..', '..', 'uploads', 'public');
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

      const filename = path.basename(filePath);
      const destPath = path.join(publicDir, filename);

      // Move temp file to public folder so it can be served
      fs.renameSync(filePath, destPath);

  const port = process.env.PORT || '5000';
  // Prefer a configured CLIENT_URL (set this in Render to your frontend URL).
  // Fall back to localhost when running locally.
  const clientUrl = process.env.CLIENT_URL || `http://localhost:${port}`;
  const url = `${clientUrl.replace(/\/$/, '')}/uploads/public/${encodeURIComponent(filename)}`;
  return url;
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: `wastechef/${folder}`,
      quality: 'auto',
      fetch_format: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};

export const extractPublicId = (url: string): string => {
  const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches?.[1] || '';
};