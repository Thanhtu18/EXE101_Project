import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Loader2, Minus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

// Simple markdown renderer: supports **bold**, *italic*, and newlines
const renderMarkdown = (text: string) => {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");
  return { __html: html };
};

interface Message {
  text: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Xin chào! Tôi là trợ lý ảo MapHome. Tôi có thể giúp gì cho bạn hôm nay?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    
    const newUserMsg: Message = {
      text: userMessage,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const API_BASE = (import.meta as any).env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages
            .filter((_, idx) => idx > 0)
            .map(m => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.text
            })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to get AI response");
      }

      const data = await response.json();
      const answerText = data.answer || "Xin lỗi, tôi không thể trả lời lúc này.";

      setMessages((prev) => [
        ...prev,
        {
          text: answerText,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);

      setIsLoading(false);

    } catch (error) {
      console.error("AI Chat Error:", error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          text: "Xin lỗi, tôi đang gặp chút sự cố kỹ thuật. Vui lòng thử lại sau giây lát!",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[380px] h-[540px] max-h-[80vh] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-white/40 bg-white/80 backdrop-blur-xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300 ease-out">
          
          {/* Header - Refined & Professional */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-[15px] text-slate-800 leading-none">MapHome AI</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trực tuyến</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
              >
                <Minus size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area - Modern Chat Style */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.role === "user" ? "ml-auto" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all animate-in fade-in zoom-in-95 duration-200",
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                  )}
                  dangerouslySetInnerHTML={renderMarkdown(msg.text)}
                />
                <span className={cn(
                  "text-[10px] text-slate-400 mt-1",
                  msg.role === "user" ? "text-right mr-1" : "text-left ml-1"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex flex-col mr-auto max-w-[85%] animate-pulse">
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-indigo-500" />
                  <span className="text-[12px] font-medium text-slate-400 italic">Đang suy nghĩ...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Integrated & Subtle */}
          <div className="p-4 bg-white/40 border-t border-gray-100">
            <form onSubmit={handleSend} className="flex gap-2 bg-white border border-slate-200 p-1.5 pl-4 rounded-xl shadow-sm focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hỏi tôi bất cứ điều gì..."
                className="flex-1 bg-transparent border-none py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!message.trim() || isLoading}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white h-9 w-9 shrink-0 shadow-md transform active:scale-95 transition-all"
              >
                <Send size={16} />
              </Button>
            </form>
            <p className="text-center text-[9px] text-slate-400 mt-2 font-medium">Bản quyền của MapHome AI Advisor</p>
          </div>
        </div>
      )}

      {/* Floating Button - Simplified & High Contrast */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95",
          isOpen 
            ? "bg-slate-800 text-white" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:rotate-12"
        )}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </Button>
    </div>
  );
};
