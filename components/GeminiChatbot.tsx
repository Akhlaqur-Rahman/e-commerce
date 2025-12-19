
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm Lumina Assistant. How can I help you find the perfect product today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Initialize the Google Generative AI client
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_KEY || '');
      
      // Get the Gemini Pro model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash'

       });
      
      // Start a chat session
      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.9,
        },
      });

      // Send the message and get the response
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const modelText = response.text();
      
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-primary-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Rahman Assistant</h3>
                <div className="flex items-center gap-1 text-[10px] opacity-80">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  Online & Ready to help
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-900/50"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${msg.role === 'user' ? 'bg-primary-500' : 'bg-slate-600 dark:bg-slate-700'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white bg-slate-600 dark:bg-slate-700">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-primary-500" />
                    <span className="text-xs text-slate-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg disabled:opacity-30 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              Powered by <Sparkles size={10} className="text-primary-500" /> Gemini AI
            </p>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 active:scale-95 ${
            isOpen 
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rotate-90' 
              : 'bg-primary-600 text-white hover:bg-primary-700 ring-4 ring-primary-500/20'
          }`}
        >
          {isOpen ? <X size={24} /> : (
            <div className="relative">
              <MessageSquare size={24} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
          )}
        </button>
        {!isOpen && (
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Ask AI Assistant
            <div className="absolute top-1/2 right-0 w-2 h-2 -mr-1 bg-slate-800 transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiChatbot;
