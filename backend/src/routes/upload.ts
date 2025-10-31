import express, { Response } from 'express';
import { upload, uploadToCloudinary } from '../utils/cloudinary';
import { authenticate } from '../middleware/auth';
import { sendResponse, sendError } from '../utils/response';
import fs from 'fs';
import { AuthRequest } from '../types';

const router = express.Router();

router.post('/image', authenticate, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      sendError(res, 400, 'No image file provided');
      return;
    }

    const { folder = 'general' } = req.body;

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.path, folder);

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    sendResponse(res, 200, 'Image uploaded successfully', { imageUrl });
  } catch (error) {
    console.error('Upload image error:', error);
    
    // Clean up temporary file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    sendError(res, 500, 'Failed to upload image');
  }
});

export default router;