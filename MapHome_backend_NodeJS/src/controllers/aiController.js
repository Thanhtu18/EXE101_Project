const OpenAI = require("openai");
const Groq = require("groq-sdk");

/**
 * ==========================================
 * CẤU HÌNH HỆ THỐNG AI
 * ==========================================
 */
const SYSTEM_PROMPT = `
Bạn là chuyên gia tư vấn bất động sản và phòng trọ của MapHome.
Hãy giúp người dùng tìm phòng, giải đáp thắc mắc về chính sách thuê,
hoặc hỗ trợ chủ trọ tối ưu bài đăng.
Trả lời lịch sự, chuyên nghiệp và bằng tiếng Việt.
`.trim();

/**
 * Helper: Chuyển đổi lịch sử chat sang định dạng chuẩn OpenAI
 */
const buildMessages = (message, history) => [
  { role: "system", content: SYSTEM_PROMPT },
  ...(Array.isArray(history) ? history : [])
    .filter(h => h && (h.role || h.parts))
    .map(h => ({
      role: (h.role === "assistant" || h.role === "model") ? "assistant" : "user",
      content: h.parts?.[0]?.text || h.content || ""
    })),
  { role: "user", content: message }
];

/**
 * ==========================================
 * CÁC NHÀ CUNG CẤP AI (AI PROVIDERS)
 * ==========================================
 */
const PROVIDERS = {
  // --- OPENROUTER (Cho Gemini Free) ---
  openrouter: async (apiKey, messages) => {
    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "MapHome AI Advisor",
      }
    });
    const response = await client.chat.completions.create({
      model: "openrouter/auto", // Tự động chọn model miễn phí tốt nhất
      messages
    });
    return response.choices[0]?.message?.content;
  },

  // --- GROQ (Cho Llama 3) ---
  groq: async (apiKey, messages) => {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
    });
    return completion.choices[0]?.message?.content;
  }
};

/**
 * ==========================================
 * CHÍNH CONTROLLER XỬ LÝ CHAT
 * ==========================================
 */
exports.chatWithAI = async (req, res) => {
  try {
    const { message, history, model: requestedModel = "groq" } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!message) {
      return res.status(400).json({ error: "MISSING_MESSAGE", message: "Nội dung tin nhắn trống!" });
    }

    // 2. Chuẩn bị Keys và Xác định Provider (Nhà cung cấp)
    const keys = {
      openrouter: (process.env.OPENROUTER_API_KEY || "").trim(),
      groq: (process.env.GROQ_API_KEY || "").trim()
    };

    // Ánh xạ model người dùng chọn sang Provider tương ứng
    const providerMap = {
      gemini: "openrouter",
      openrouter: "openrouter",
      llama: "groq",
      groq: "groq"
    };

    const targetProvider = providerMap[requestedModel.toLowerCase()] || "groq";
    const apiKey = keys[targetProvider];

    // 3. Kiểm tra API Key của Provider đó
    if (!apiKey) {
      return res.status(400).json({
        error: "NO_API_KEY",
        message: `Chưa cấu hình API Key cho ${targetProvider.toUpperCase()}`
      });
    }

    // 4. Gọi AI và trả về kết quả
    try {
      const messages = buildMessages(message, history);
      const answer = await PROVIDERS[targetProvider](apiKey, messages);

      return res.status(200).json({
        answer,
        role: "assistant",
        model: targetProvider
      });

    } catch (apiError) {
      console.error(`[AI Error - ${targetProvider}]:`, apiError.message);
      
      return res.status(500).json({
        error: "PROVIDER_FAILED",
        message: `Hệ thống ${requestedModel.toUpperCase()} bận, vui lòng thử lại sau giây lát!`
      });
    }

  } catch (finalError) {
    console.error("Critical System Error:", finalError.message);
    res.status(500).json({ error: "SYSTEM_ERROR", message: "Lỗi máy chủ MapHome AI" });
  }
};