const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function listModels() {
  try {
    const key = (process.env.GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(key);
    // There is no direct listModels in the browser-style SDK usually, 
    // but we can try common ones and see which one doesn't 404.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("test");
        console.log(`MODEL WORKING: ${m}`);
        return;
      } catch (e) {
        console.log(`MODEL FAILED (${m}): ${e.message}`);
      }
    }
  } catch (err) {
    console.error("List error:", err.message);
  }
}

listModels();
