import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from "../controllers/resumeController.js";
import upload from "../configs/multer.js";
const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', protect, upload.single('image') ,  updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);
// Add this to your routes to test ImageKit
resumeRouter.post('/test-imagekit', upload.single('image'), protect, async (req, res) => {
  try {
    console.log('🧪 Testing ImageKit configuration...');
    
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Check ImageKit configuration
    console.log('🔑 ImageKit config check:', {
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'Set' : 'Missing',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'Set' : 'Missing',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'Missing'
    });

    const fileBuffer = fs.readFileSync(req.file.path);
    
    const uploadResult = await imageKit.upload({
      file: fileBuffer,
      fileName: `test-${Date.now()}.jpg`,
      folder: "/user-resumes",
    });

    // Clean up
    fs.unlinkSync(req.file.path);

    console.log('✅ ImageKit test successful!');
    res.json({ 
      success: true,
      url: uploadResult.url,
      fileId: uploadResult.fileId,
      message: "ImageKit is working correctly"
    });
    
  } catch (error) {
    console.error('❌ ImageKit test failed:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(400).json({ 
      success: false,
      message: "ImageKit test failed: " + error.message 
    });
  }
});
export default resumeRouter