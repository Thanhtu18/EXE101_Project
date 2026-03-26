const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const key = (process.env.GEMINI_API_KEY || "").trim();
console.log("Testing Key:", key);
console.log("Key Length:", key.length);

const genAI = new GoogleGenerativeAI(key);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("SUCCESS:", result.response.text());
  } catch (e) {
    console.error("FAILED:", e.message);
    if (e.errorDetails) {
      console.error("Details:", JSON.stringify(e.errorDetails, null, 2));
    }
  }
}

test();
