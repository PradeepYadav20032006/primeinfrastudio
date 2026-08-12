import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

// Placeholder AI chatbot widget. Wire this up to an LLM API (e.g. the Anthropic
// or OpenAI API through a backend proxy endpoint) to make it fully functional.
const STARTER_REPLIES = [
  "Thanks for reaching out! I'm the PrimeInfraStudio assistant (demo mode). For real project queries, please use the Get a Quote form or WhatsApp us directly.",
  "I can help point you to our Services, Projects, or Contact page. What are you looking for?",
  "This is a placeholder response - connect me to an AI backend to answer questions live!",
];

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "👋 Hi! I'm the PrimeInfraStudio assistant. Ask me anything about our services." },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    const botMsg = { from: 'bot', text: STARTER_REPLIES[Math.floor(Math.random() * STARTER_REPLIES.length)] };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        aria-label="Open AI chat assistant"
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-charcoal-900 dark:bg-amber-600 text-white shadow-lg flex items-center justify-center"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-6 z-40 w-[90vw] max-w-sm h-[28rem] bg-white dark:bg-charcoal-900 rounded-2xl shadow-2xl border border-charcoal-100 dark:border-charcoal-800 flex flex-col overflow-hidden"
          >
            <div className="bg-charcoal-900 dark:bg-charcoal-950 text-white px-4 py-3 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <div>
                <p className="text-sm font-semibold">PrimeInfraStudio Assistant</p>
                <p className="text-[11px] text-charcoal-400">Demo mode - not connected to a live AI</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      m.from === 'user'
                        ? 'bg-amber-600 text-white rounded-br-sm'
                        : 'bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-100 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-charcoal-100 dark:border-charcoal-800 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 input-field !py-2 text-sm"
              />
              <button onClick={handleSend} className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-md">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
