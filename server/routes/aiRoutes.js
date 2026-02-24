import express from 'express';
import { 
    enhanceJobDescription, 
    enhanceProfessionalSummary, 
    uploadResume,
    testAIConnection 
} from '../controllers/aiController.js';
import protect from '../middlewares/authMiddleware.js';

const aiRouter = express.Router();

// Protected routes
aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRouter.post('/upload-resume', protect, uploadResume);

// Test route (optional)
aiRouter.get('/test', protect, testAIConnection);

export default aiRouter;