import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle, Clock, MoreVertical, CreditCard, User } from 'lucide-react';

const InvoiceCard = ({ invoice, onMockPay, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-[2rem] p-6 relative group overflow-hidden border border-white/5"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-700/50 flex items-center justify-center text-slate-300">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">{invoice.clientName}</h4>
            <p className="text-xs text-slate-500">{new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-1.5
          ${invoice.status === 'Paid' 
            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
            : 'bg-accent/10 text-accent border border-accent/20 animate-pulse'}
        `}>
          <div className={`w-1.5 h-1.5 rounded-full ${invoice.status === 'Paid' ? 'bg-green-400' : 'bg-accent shadow-[0_0_8px_rgba(255,122,24,0.8)]'}`} />
          <span>{invoice.status}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-slate-500 mb-1 uppercase tracking-tighter font-bold">Total Amount</p>
        <p className="text-3xl font-black text-white font-outfit">₹{invoice.totalAmount.toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-3">
        {invoice.status === 'Pending' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMockPay(invoice._id)}
            className="flex-1 bg-white text-black font-bold py-3 rounded-2xl text-sm flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Now</span>
          </motion.button>
        )}
        <a
          href={invoice.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-2xl transition-all border border-white/10 hover:bg-white/5
            ${invoice.status === 'Paid' ? 'w-full py-3 text-sm font-bold text-slate-300' : 'w-14 h-14 text-slate-400'}
          `}
        >
          {invoice.status === 'Paid' ? (
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Receipt</span>
            </span>
          ) : (
            <ExternalLink className="w-5 h-5" />
          )}
        </a>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary opacity-0 group-hover:opacity-20 blur-2xl transition-opacity pointer-events-none" />
    </motion.div>
  );
};

const InvoiceList = ({ invoices, onMockPay, fullView = false }) => {
  if (invoices.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24 glass-card rounded-[3rem] border-2 border-dashed border-white/5"
      >
        <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-600">
            <Clock className="w-10 h-10" />
        </div>
        <p className="text-slate-400 text-xl font-medium">No activity detected yet.</p>
        <p className="text-slate-600 mt-2">Paste a business message to generate your first invoice.</p>
      </motion.div>
    );
  }

  const displayInvoices = fullView ? invoices : invoices.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence>
        {displayInvoices.map((invoice, index) => (
          <InvoiceCard 
            key={invoice._id} 
            invoice={invoice} 
            onMockPay={onMockPay} 
            index={index} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceList;
