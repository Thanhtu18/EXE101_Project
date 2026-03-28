const Groq = require("groq-sdk");

const SYSTEM_PROMPT = `
Bạn là chuyên gia tư vấn bất động sản và phòng trọ của MapHome.
Hãy giúp người dùng tìm phòng, giải đáp thắc mắc về chính sách thuê,
hoặc hỗ trợ chủ trọ tối ưu bài đăng.
Trả lời lịch sự, chuyên nghiệp và bằng tiếng Việt.
`.trim();

const buildGroqMessages = (message, history = []) => [
  { role: "system", content: SYSTEM_PROMPT },
  ...history.map(h => ({
    role: (h.role === "assistant" || h.role === "model") ? "assistant" : "user",
    content: h.parts?.[0]?.text || h.content || ""
  })),
  { role: "user", content: message }
];

const callGroq = async (apiKey, message, history = []) => {
  if (!apiKey) throw new Error("GROQ_API_KEY_MISSING");
  
  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    messages: buildGroqMessages(message, history),
    model: "llama-3.3-70b-versatile",
    temperature: 0.7
  });

  return completion.choices?.[0]?.message?.content || "";
};

exports.chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "INVALID_MESSAGE",
        message: "Tin nhắn không hợp lệ!"
      });
    }

    const groqKey = (process.env.GROQ_API_KEY || "").trim();

    console.log(`[AI] Using GROQ (Llama 3)`);

    const answer = await callGroq(groqKey, message, history);

    return res.status(200).json({
      success: true,
      answer,
      provider: "groq"
    });

  } catch (error) {
    console.error("[AI SYSTEM ERROR]", error.message);

    return res.status(500).json({
      error: "AI_SYSTEM_ERROR",
      message: error.message === "GROQ_API_KEY_MISSING" 
        ? "Hệ thống AI chưa được cấu hình Key!" 
        : "Hệ thống AI đang bận, thử lại sau!"
    });
  }
};