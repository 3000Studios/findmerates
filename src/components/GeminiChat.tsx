import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, X, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function GeminiChat() {
const [isOpen, setIsOpen] = useState(false);
const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
  { role: 'model', text: 'Hi! I can help you compare rates, understand mortgage terms, or find the best CD rates. What are you looking for?' }
]);
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const scrollRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }
}, [messages]);

const handleSend = async () => {
  if (!input.trim() || isLoading) return;
  const userMessage = input.trim();
  setInput('');
  setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
  setIsLoading(true);
  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userMessage,
      config: {
        systemInstruction: "You are a financial rate expert for FindMeRates.com. Help users compare mortgage rates, CD rates, auto loans, and personal loans. Be concise, accurate, and helpful. Always recommend users verify rates with lenders before making decisions.",
      }
    });
    const aiText = response.text || "I'm sorry, I couldn't process that request.";
    setMessages(prev => [...prev, { role: 'model', text: aiText }]);
  } catch (error) {
    setMessages(prev => [...prev, { role: 'model', text: "Having trouble connecting right now. Please try again in a moment." }]);
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
    {isOpen && (
      <div className="w-80 md:w-96 h-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        <div className="bg-brand-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-bold text-sm">Rate Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                msg.role === 'user'
                  ? "bg-brand-600 text-white rounded-tr-none"
                  : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              </div>
            </div>
          )}
        </div>
        <div className="p-3 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about rates..."
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-brand-600 text-white p-2 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )}
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="bg-brand-600 hover:bg-brand-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      aria-label="Open Rate Assistant"
    >
      {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
    </button>
  </div>
);
}