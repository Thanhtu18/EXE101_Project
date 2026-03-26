const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    console.log("Testing Gemini with model: gemini-1.5-flash-latest...");
    const result = await model.generateContent("Xin chào, bạn là ai?");
    const response = await result.response;
    console.log("Response text:", response.text());
    console.log("SUCCESS: Gemini is working!");
  } catch (error) {
    console.error("Gemini Test Failed:");
    console.error("Message:", error.message);
    if (error.status) console.error("Status:", error.status);
    if (error.errorDetails) console.error("Details:", JSON.stringify(error.errorDetails, null, 2));
  }
}

testGemini();
