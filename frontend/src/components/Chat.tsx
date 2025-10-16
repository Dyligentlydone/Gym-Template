import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Message } from '../types';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let apiUrl = import.meta.env.VITE_API_URL || '';
      
      console.log('Raw API URL:', apiUrl);
      
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }

      // Ensure URL has no trailing slash
      apiUrl = apiUrl.replace(/\/$/, '');

      console.log('Using API URL:', apiUrl);
      
      const response = await axios.post(`${apiUrl}/api/chat`, {
        message: input,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 60000, // 60 second timeout
        withCredentials: false
      });

      console.log('API Response:', response.data); // For debugging

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: import.meta.env.VITE_API_URL
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error.response?.data?.error || error.message || 'Something went wrong'}. Status: ${error.response?.status || 'unknown'}`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] mt-0">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm sm:max-w-md md:max-w-lg rounded-2xl px-4 py-3 backdrop-blur-md ${
                    message.role === 'user'
                      ? 'bg-[#FFA500]/90 text-black ml-4'
                      : 'bg-white/10 text-white mr-4'
                  }`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-1 opacity-50">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 mr-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input */}
      <div className="border-t border-white/10 backdrop-blur-md bg-black/30 p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4 items-end">
          <div className="flex-1 min-h-[44px]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              className="w-full resize-none rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500] min-h-[44px] max-h-32"
              rows={1}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-[#FFA500] p-3 text-black hover:bg-[#FFB52E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
