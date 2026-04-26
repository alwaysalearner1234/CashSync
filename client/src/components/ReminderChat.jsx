import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCheck, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

const MessageBubble = ({ text, time, sender, tone, index }) => {
  const isUser = sender === 'me';
  
  const toneStyles = {
    friendly: 'border-secondary/20 bg-secondary/5 text-secondary-200',
    reminder: 'border-accent/20 bg-accent/5 text-accent-200',
    urgent: 'border-red-500/20 bg-red-500/5 text-red-200 animate-pulse'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`max-w-[80%] relative p-4 rounded-3xl border ${isUser ? 'glass-card border-primary/30 rounded-tr-none' : 'glass-card rounded-tl-none ' + (toneStyles[tone] || 'border-white/10')}`}>
        <p className="text-sm md:text-base mb-2">{text}</p>
        <div className="flex items-center justify-end space-x-2 text-[10px] opacity-50">
          <span>{time}</span>
          {isUser && <CheckCheck className="w-3 h-3 text-secondary" />}
        </div>
      </div>
    </motion.div>
  );
};

const ReminderChat = () => {
  const messages = [
    { text: "Hey Sarah! Hope you're doing well. Just sent over the invoice for the brand strategy work. Let me know if you received it! 😊", time: "10:30 AM", sender: "me", tone: "friendly" },
    { text: "Hi! Yes, I got it. Will process it by the end of the day.", time: "11:15 AM", sender: "client", tone: "" },
    { text: "Friendly reminder: The invoice for the Brand Strategy is due tomorrow. You can pay easily here: rzp.io/i/abc", time: "09:00 AM", sender: "me", tone: "reminder" },
    { text: "URGENT: Your payment for Brand Strategy is now 2 days overdue. Please settle this immediately to avoid service pause.", time: "02:45 PM", sender: "me", tone: "urgent" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-black text-white font-outfit mb-4">Smart Reminders</h2>
        <p className="text-slate-400 text-lg">AI handles the follow-ups so you can focus on the work. From friendly nudges to urgent escalations.</p>
      </header>

      <div className="glass-card rounded-[3rem] p-8 md:p-12 relative overflow-hidden border border-white/5">
        {/* Chat Header */}
        <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white">Client Conversation Flow</h4>
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span>Automated by CashSync AI</span>
            </p>
          </div>
        </div>

        {/* Chat History */}
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} {...msg} index={i} />
          ))}
        </div>

        {/* Input Placeholder */}
        <div className="mt-10 pt-6 border-t border-white/5 flex items-center space-x-4 opacity-50">
          <div className="flex-1 h-14 bg-white/5 rounded-2xl border border-white/5 flex items-center px-6 text-slate-500 italic">
            AI is preparing the next nudge...
          </div>
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
            <Send className="w-5 h-5" />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-3xl pointer-events-none" />
      </div>

      {/* Logic explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 glass-card rounded-3xl border border-white/5">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h5 className="font-bold text-white mb-2 text-sm">Friendly Nudge</h5>
          <p className="text-xs text-slate-500">Sent 2 days before due date to keep things casual.</p>
        </div>
        <div className="p-6 glass-card rounded-3xl border border-white/5">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h5 className="font-bold text-white mb-2 text-sm">Escalation</h5>
          <p className="text-xs text-slate-500">Increased urgency on the due date with a payment link.</p>
        </div>
        <div className="p-6 glass-card rounded-3xl border border-white/5">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 mb-4">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h5 className="font-bold text-white mb-2 text-sm">Strict Warning</h5>
          <p className="text-xs text-slate-500">Sent after 48 hours overdue to ensure prompt settlement.</p>
        </div>
      </div>
    </div>
  );
};

export default ReminderChat;
