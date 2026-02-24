import OpenAI from "openai";

let openai;

// Check if API key exists
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY not found! Using mock OpenAI for development.");
  
  // Create a mock OpenAI instance
  openai = {
    chat: {
      completions: {
        create: async ({ messages }) => {
          console.log("📝 Mock OpenAI called");
          return {
            choices: [{
              message: {
                content: "This is a mock response. Please add OPENAI_API_KEY to .env file for real AI features."
              }
            }]
          };
        }
      }
    }
  };
} else {
  // Real OpenAI instance
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log("✅ OpenAI initialized successfully");
}

export default openai;