import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";
import path from "path";

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    const newResume = await Resume.create({ userId, title });
    return res.status(201).json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const deletedResume = await Resume.findOneAndDelete({ userId, _id: resumeId });
    if (!deletedResume) return res.status(404).json({ message: "Resume not found" });
    return res.status(200).json({ message: "Resume deleted successfully", resume: deletedResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    const { __v, createdAt, updatedAt, ...resumeData } = resume.toObject();
    return res.status(200).json({ resume: resumeData });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};



export const updateResume = async (req, res) => {
  try {
    // ========== NEW LOGGING CODE ==========
    console.log('🔄 ========== UPDATE RESUME START ==========');
    console.log('👤 User ID:', req.userId);
    
    // Log the entire request for debugging
    console.log('📨 Request details:', {
      method: req.method,
      url: req.url,
      headers: {
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length']
      },
      bodyKeys: Object.keys(req.body),
      file: req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file received',
      files: req.files ? 'Files received' : 'No files'
    });
    // ========== END NEW LOGGING CODE ==========

    // ========== YOUR EXISTING CODE ==========
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    console.log('📄 Resume ID:', resumeId);
    console.log('📁 File received:', image ? `Yes - ${image.originalname} (${image.size} bytes)` : 'No');

    // Validate resumeId
    if (!resumeId) {
      return res.status(400).json({ message: "Resume ID is required" });
    }

    let resumeDataCopy;
    
    // Parse resumeData
    if (typeof resumeData === 'string') {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = resumeData;
    }

    // Handle image upload to ImageKit
    if (image) {
      console.log('🖼️ Starting ImageKit upload...');
      
      try {
        // Verify the file exists
        if (!fs.existsSync(image.path)) {
          throw new Error('Uploaded file not found');
        }

        const fileBuffer = fs.readFileSync(image.path);
        
        const uploadOptions = {
          file: fileBuffer,
          fileName: `resume-${userId}-${Date.now()}${path.extname(image.originalname)}`,
          folder: "/user-resumes",
        };

        if (removeBackground === 'yes') {
          uploadOptions.transformations = [
            {
              width: "300",
              height: "300",
              focus: "face",
              crop: "thumb",
              effect: "bg-removal"
            },
          ];
        }

        console.log('🚀 Uploading to ImageKit...');
        const response = await imageKit.upload(uploadOptions);
        
        console.log('✅ ImageKit upload successful!');
        console.log('🔗 Image URL:', response.url);
        
        if (!resumeDataCopy.personal_info) {
          resumeDataCopy.personal_info = {};
        }
        
        resumeDataCopy.personal_info.image = response.url;

        fs.unlinkSync(image.path);
        
      } catch (uploadError) {
        console.error('❌ ImageKit upload failed:', uploadError);
        
        if (fs.existsSync(image.path)) {
          fs.unlinkSync(image.path);
        }
        
        return res.status(400).json({ 
          message: 'Image upload failed: ' + uploadError.message 
        });
      }
    }

    // Update resume in database
    console.log('💾 Saving to database...');
    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    console.log('✅ Resume saved successfully with image:', resume.personal_info?.image);
    console.log('========== UPDATE RESUME END ==========');

    return res.status(200).json({ 
      message: "Saved successfully", 
      resume 
    });

  } catch (error) {
    console.error('❌ Error in updateResume:', error);
    
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(400).json({ 
      message: error.message || "Failed to update resume" 
    });
  }
};