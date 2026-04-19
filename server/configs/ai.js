import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not found! Using mock AI for development.");
  
  // Create a mock instance
  genAI = {
    getGenerativeModel: () => ({
      generateContent: async () => {
        console.log("📝 Mock Gemini called");
        return {
          response: {
            text: () => "This is a mock response. Please add GEMINI_API_KEY to .env file for real AI features."
          }
        };
      }
    })
  };
} else {
  // Real Gemini instance
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("✅ Gemini AI initialized successfully");
}

export default genAI;