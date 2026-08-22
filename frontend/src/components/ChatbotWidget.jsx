import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import customerApi from '../utils/customerApi';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "👋 Hi! I'm the PrimeInfraStudio AI Assistant. Ask me anything about our construction, renovation, or interior design services!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open, loading, streaming]);

  const handleSend = async () => {
    if (!input.trim() || loading || streaming) return;

    const userText = input.trim();
    const userMsg = { from: 'user', text: userText };
    
    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
      const token = localStorage.getItem('pis_customer_token');

      // Set up AbortController for a 60-second request timeout limit
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds

      // Send the current message and history to the backend via native fetch for stream support
      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: userText,
          history: messages,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      
      // If it is not a stream (meaning it returned standard JSON error payload)
      if (!response.ok || contentType.includes('application/json')) {
        const errData = await response.json();
        throw new Error(errData.message || "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.");
      }

      // Switch to streaming mode and turn off bouncing dots
      setStreaming(true);
      setLoading(false);

      // Add a placeholder message for the bot immediately
      setMessages((prev) => [...prev, { from: 'bot', text: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let finished = false;
      let botResponseText = '';
      let buffer = '';

      while (!finished) {
        const { value, done } = await reader.read();
        if (done) {
          finished = true;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const line = part.trim();
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6).trim();
            if (dataStr === '[DONE]') {
              finished = true;
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                botResponseText += parsed.text;
                // Update the last message in real-time
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { from: 'bot', text: botResponseText };
                  return updated;
                });
              }
            } catch (e) {
              if (e.message.includes('API key') || e.message.includes('assistant')) {
                throw e; // Rethrow actual API configuration errors
              }
              // Skip partial chunks
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      let errMsg = err.message || "Oops! Something went wrong. Please check your internet connection and try again.";
      if (err.name === 'AbortError') {
        errMsg = "The request timed out. Please check your internet connection or try again later.";
      }
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.from === 'bot' && (lastMsg.text === '' || streaming)) {
          updated[updated.length - 1] = { 
            from: 'bot', 
            text: errMsg
          };
        } else {
          updated.push({ 
            from: 'bot', 
            text: errMsg
          });
        }
        return updated;
      });
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  // Helper function to convert markdown style text (**bold** and [label](url)) into React components
  const formatMessageText = (text) => {
    if (!text) return '';
    
    // Split into paragraphs/lines
    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
      if (isBullet) {
        trimmed = trimmed.substring(2);
      }

      // Match bold text (**text**) and markdown links ([text](url))
      const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
      const parts = trimmed.split(regex);

      const processedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-charcoal-950 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        
        if (part.startsWith('[') && part.includes('](')) {
          const label = part.substring(1, part.indexOf(']'));
          const url = part.substring(part.indexOf('](') + 2, part.length - 1);
          
          if (url.startsWith('/')) {
            return (
              <Link
                key={pIdx}
                to={url}
                className="text-amber-600 dark:text-amber-400 underline font-medium hover:text-amber-700 dark:hover:text-amber-300"
              >
                {label}
              </Link>
            );
          } else {
            return (
              <a
                key={pIdx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-amber-400 underline font-medium hover:text-amber-700 dark:hover:text-amber-300"
              >
                {label}
              </a>
            );
          }
        }

        return part;
      });

      if (isBullet) {
        return (
          <li key={idx} className="list-disc ml-4 mt-1 pl-1 text-charcoal-700 dark:text-charcoal-200">
            {processedLine}
          </li>
        );
      }

      return (
        <p key={idx} className="mt-1 text-charcoal-700 dark:text-charcoal-200">
          {processedLine}
        </p>
      );
    });
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        aria-label="Open AI chat assistant"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-charcoal-900 dark:bg-amber-600 text-white shadow-lg flex items-center justify-center cursor-pointer"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-sm h-[32rem] bg-white dark:bg-charcoal-900 rounded-2xl shadow-2xl border border-charcoal-100 dark:border-charcoal-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-charcoal-900 dark:bg-charcoal-950 text-white px-4 py-3 flex items-center justify-between border-b border-charcoal-800">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500 animate-pulse" />
                <div>
                  <p className="text-sm font-semibold">PrimeInfra Assistant</p>
                  <p className="text-[11px] text-charcoal-400">Powered by Gemini AI</p>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="text-charcoal-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-charcoal-200 dark:scrollbar-thumb-charcoal-800">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      m.from === 'user'
                        ? 'bg-amber-600 text-white rounded-tr-none'
                        : 'bg-charcoal-50 dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-100 rounded-tl-none border border-charcoal-100/50 dark:border-charcoal-700/50'
                    }`}
                  >
                    {m.from === 'user' ? m.text : formatMessageText(m.text)}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-charcoal-50 dark:bg-charcoal-800 rounded-2xl rounded-tl-none px-4 py-3 border border-charcoal-100/50 dark:border-charcoal-700/50 shadow-sm flex items-center space-x-1">
                    <span className="w-2 h-2 bg-charcoal-400 dark:bg-charcoal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-charcoal-400 dark:bg-charcoal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-charcoal-400 dark:bg-charcoal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-charcoal-100 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/90 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading || streaming}
                placeholder="Type a message..."
                className="flex-1 input-field !py-2 text-sm bg-charcoal-50 dark:bg-charcoal-800 border-charcoal-200 dark:border-charcoal-700 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 text-charcoal-800 dark:text-white"
              />
              <button 
                onClick={handleSend} 
                disabled={loading || streaming || !input.trim()}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 disabled:cursor-not-allowed text-white p-2.5 rounded-md transition-colors cursor-pointer"
              >
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
