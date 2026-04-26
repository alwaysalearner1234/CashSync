import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from './components/ChatInput';
import InvoicePreview from './components/InvoicePreview';
import DashboardStats from './components/DashboardStats';
import InvoiceList from './components/InvoiceList';
import ReminderChat from './components/ReminderChat';
import { fetchInvoices, fetchStats, createInvoice, mockPay } from './api';
import { Wallet, LayoutDashboard, MessageSquare, PlusCircle, Settings, RefreshCw } from 'lucide-react';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({});
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [invRes, statRes] = await Promise.all([fetchInvoices(), fetchStats()]);
      setInvoices(invRes.data);
      setStats(statRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirmInvoice = async () => {
    setLoading(true);
    try {
      await createInvoice(parsedData);
      setParsedData(null);
      await loadData();
    } catch (error) {
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleMockPay = async (id) => {
    try {
      await mockPay(id);
      await loadData();
    } catch (error) {
      alert('Mock payment failed');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-slate-200 selection:bg-primary/30 pb-24 md:pb-10">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="glow-blob w-[500px] h-[500px] bg-primary/20 -top-20 -left-20" 
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 150, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="glow-blob w-[600px] h-[600px] bg-secondary/15 bottom-0 -right-20" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="glow-blob w-[400px] h-[400px] bg-accent/10 top-1/2 left-1/3" 
        />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-morphism border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Wallet className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-outfit tracking-tight">CashSync</span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            {['Dashboard', 'Invoices', 'Reminders'].map((item) => (
              <button 
                key={item}
                onClick={() => setActiveTab(item.toLowerCase())}
                className={`text-sm font-semibold transition-all hover:text-white ${activeTab === item.toLowerCase() ? 'text-white' : 'text-slate-400'}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={loadData}
              disabled={refreshing}
              className="p-3 rounded-xl glass-morphism hover:bg-white/10 transition-all active:scale-95"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <header className="mb-12 text-center md:text-left">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-black text-white mb-4 font-outfit"
                >
                  Welcome to the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">Future</span>
                </motion.h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl">
                  Transform your business conversations into instant revenue with AI-powered invoicing and smart reminders.
                </p>
              </header>

              <DashboardStats stats={stats} />

              <section className="mb-20">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-1.5 h-8 bg-primary rounded-full" />
                  <h2 className="text-3xl font-black text-white font-outfit">Magic Input</h2>
                </div>
                <ChatInput onParsed={setParsedData} />
              </section>

              <section>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-8 bg-secondary rounded-full" />
                    <h2 className="text-3xl font-black text-white font-outfit">Live Stream</h2>
                  </div>
                </div>
                <InvoiceList invoices={invoices} onMockPay={handleMockPay} />
              </section>
            </motion.div>
          )}

          {activeTab === 'reminders' && (
            <motion.div
              key="reminders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReminderChat />
            </motion.div>
          )}
          
          {activeTab === 'invoices' && (
            <motion.div
              key="invoices-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InvoiceList invoices={invoices} onMockPay={handleMockPay} fullView />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal */}
        <AnimatePresence>
          {parsedData && (
            <InvoicePreview
              data={parsedData}
              onConfirm={handleConfirmInvoice}
              onCancel={() => setParsedData(null)}
              loading={loading}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-6 left-6 right-6 md:hidden z-50">
        <div className="glass-morphism rounded-3xl p-2 flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
          {[
            { id: 'dashboard', icon: LayoutDashboard },
            { id: 'invoices', icon: PlusCircle },
            { id: 'reminders', icon: MessageSquare },
            { id: 'settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 'text-slate-500'}`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>

      <footer className="py-12 text-center text-slate-600 text-sm mt-20 border-t border-white/5 relative z-10">
        <p>© 2026 CashSync — The Premium Fintech OS</p>
      </footer>
    </div>
  );
}

export default App;
