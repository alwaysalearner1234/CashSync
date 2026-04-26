import React from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { IndianRupee, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const CountUp = ({ value }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const StatCard = ({ title, value, icon: Icon, color, subtext, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card p-6 rounded-3xl relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-gradient-to-br ${color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
    
    <div className="flex items-start justify-between mb-4">
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center space-x-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full">
        <TrendingUp className="w-3 h-3" />
        <span>+12%</span>
      </div>
    </div>
    
    <div>
      <p className="text-sm font-semibold text-slate-400 mb-1">{title}</p>
      <p className="text-3xl font-black text-white font-outfit">
        {title.includes('Earnings') && '₹'}
        <CountUp value={value} />
      </p>
      {subtext && <p className="text-xs text-slate-500 mt-2 flex items-center">{subtext}</p>}
    </div>
  </motion.div>
);

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <StatCard
        index={0}
        title="Total Earnings"
        value={stats.totalEarnings || 0}
        icon={IndianRupee}
        color="from-primary to-purple-400"
        subtext="Direct revenue into your account"
      />
      <StatCard
        index={1}
        title="Pending Payments"
        value={stats.pendingPayments || 0}
        icon={Clock}
        color="from-accent to-yellow-400"
        subtext="Awaiting settlement from clients"
      />
      <StatCard
        index={2}
        title="Paid Invoices"
        value={stats.paidInvoices || 0}
        icon={CheckCircle}
        color="from-secondary to-blue-400"
        subtext="Successfully processed transactions"
      />
    </div>
  );
};

export default DashboardStats;
