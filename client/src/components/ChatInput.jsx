import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2, Zap } from 'lucide-react';

const ChatInput = ({ onParsed }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/invoices/parse-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      
      // Simulate transformation delay for visual effect
      setTimeout(() => {
        onParsed(data);
        setText('');
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Parsing failed:', error);
      alert('Failed to parse text. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-16">
      <motion.div 
        animate={{ 
          boxShadow: isFocused 
            ? "0 0 50px -12px rgba(108, 99, 255, 0.5)" 
            : "0 0 20px -12px rgba(0, 0, 0, 0.5)" 
        }}
        className={`glass-card p-2 rounded-[2rem] transition-all duration-500 ${isFocused ? 'border-primary/50' : 'border-white/10'}`}
      >
        <form onSubmit={handleSubmit} className="flex items-center p-2 gap-4">
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="e.g. 3 logos for ₹5000 each for ABC Corp"
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-lg md:text-xl py-4 px-6 resize-none min-h-[60px] max-h-[200px] font-medium"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <AnimatePresence>
              {!text && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-6 top-5 pointer-events-none flex items-center space-x-2 text-slate-500"
                >
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !text.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`h-14 w-14 md:h-16 md:w-16 rounded-3xl flex items-center justify-center transition-all shadow-xl shadow-primary/20
              ${loading || !text.trim() ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-br from-primary to-purple-600 text-white'}
            `}
          >
            {loading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <Zap className={`w-7 h-7 ${text.trim() ? 'fill-current' : ''}`} />
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Helper text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 flex justify-center space-x-6 text-slate-500 text-sm font-semibold"
      >
        <span className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-primary rounded-full" />
          <span>AI Powered</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-secondary rounded-full" />
          <span>Instant Extraction</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-accent rounded-full" />
          <span>GST Ready</span>
        </span>
      </motion.div>
    </div>
  );
};

export default ChatInput;
