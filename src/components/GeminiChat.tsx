import React, { useEffect, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { cn } from "../lib/utils";

export default function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    {
      role: "model",
      text: "I can help compare rates, terms, and tradeoffs. Ask me what matters most.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing API key");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userMessage,
        config: {
          systemInstruction:
            "You are a concise financial rate assistant for FindMeRates.com. Be accurate, brief, and practical.",
        },
      });
      setMessages((prev) => [...prev, { role: "model", text: response.text || "Try rephrasing that." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text:
            "Live chat is offline right now. Use the search bar, guide, or Pro tools for rate comparisons and we’ll keep you moving.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex h-[480px] w-80 flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/92 shadow-[0_20px_70px_rgba(16,34,68,0.18)] backdrop-blur-xl md:w-96">
          <div className="flex items-center justify-between bg-brand-900 px-4 py-4 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-semibold">Rate Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                    msg.role === "user"
                      ? "rounded-tr-md bg-brand-900 text-white"
                      : "rounded-tl-md border border-slate-200 bg-white text-slate-700",
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white p-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-700" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about rates..."
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="rounded-2xl bg-brand-900 p-3 text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-white shadow-xl shadow-brand-900/20 transition-transform hover:-translate-y-0.5"
        aria-label="Open Rate Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
