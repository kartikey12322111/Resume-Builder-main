import ImageKit from "imagekit";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Check if all required environment variables are present
const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

// Log which variables are missing (for debugging)
console.log("🔍 ImageKit Config Check:");
console.log("PUBLIC_KEY:", publicKey ? "✅ Present" : "❌ Missing");
console.log("PRIVATE_KEY:", privateKey ? "✅ Present" : "❌ Missing");
console.log("URL_ENDPOINT:", urlEndpoint ? "✅ Present" : "❌ Missing");

// Initialize ImageKit only if all credentials are present
let imagekit;

if (publicKey && privateKey && urlEndpoint) {
  try {
    imagekit = new ImageKit({
      publicKey: publicKey,
      privateKey: privateKey,
      urlEndpoint: urlEndpoint
    });
    console.log("✅ ImageKit initialized successfully");
  } catch (error) {
    console.error("❌ ImageKit initialization failed:", error.message);
    imagekit = null;
  }
} else {
  console.warn("⚠️ ImageKit credentials missing. Image upload features will not work.");
  imagekit = null;
}

// Create a wrapper object with fallback methods
const imageKitWrapper = {
  // Original ImageKit instance (might be null)
  instance: imagekit,
  
  // Safe upload method that won't crash if ImageKit is not configured
  upload: async (options) => {
    if (!imagekit) {
      console.warn("⚠️ ImageKit not configured. Using local fallback.");
      
      // Create a fallback response
      return {
        url: "https://via.placeholder.com/500", // Placeholder image
        fileId: "local-" + Date.now(),
        filePath: "/local-fallback",
        message: "ImageKit not configured - using placeholder"
      };
    }
    
    try {
      return await imagekit.upload(options);
    } catch (error) {
      console.error("❌ ImageKit upload failed:", error.message);
      throw error;
    }
  },
  
  // Check if ImageKit is properly configured
  isConfigured: () => {
    return imagekit !== null;
  },
  
  // Get the original instance (for advanced use)
  getInstance: () => {
    return imagekit;
  }
};

export default imageKitWrapper;