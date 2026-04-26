import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, FileText, User, IndianRupee, Package } from 'lucide-react';
import confetti from 'canvas-confetti';

const InvoicePreview = ({ data, onConfirm, onCancel, loading }) => {
  const handleConfirm = () => {
    onConfirm();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6C63FF', '#00D4FF', '#FF7A18']
    });
  };

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20, rotateX: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl glass-card rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(108,99,255,0.2)] border border-white/20"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white font-outfit">Confirm Invoice</h3>
              <p className="text-slate-400 text-sm">AI extracted details from your message</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="p-3 rounded-2xl hover:bg-white/10 text-slate-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <User className="w-3 h-3" />
                <span>Client Name</span>
              </p>
              <p className="text-xl font-bold text-white">{data.clientName || 'Unnamed Client'}</p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-end space-x-2">
                <IndianRupee className="w-3 h-3" />
                <span>Total Value</span>
              </p>
              <p className="text-3xl font-black text-primary font-outfit">₹{data.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <Package className="w-3 h-3" />
              <span>Line Items</span>
            </p>
            <div className="space-y-3">
              {data.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-slate-300">₹{item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-900/50 border-t border-white/5 flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-white/5 transition-all"
          >
            Edit Manually
          </button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            disabled={loading}
            className="flex-[2] bg-gradient-to-r from-primary to-purple-600 px-6 py-4 rounded-2xl font-black text-white shadow-xl shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Check className="w-6 h-6" />
              </motion.div>
            ) : (
              <>
                <Check className="w-6 h-6" />
                <span>Generate & Send</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default InvoicePreview;
