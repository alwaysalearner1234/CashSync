const cron = require('node-cron');
const { inMemoryInvoices } = require('../routes/invoiceRoutes');

// Escalation tones
const reminderTones = [
  "Friendly: Just a gentle nudge about your invoice from CashSync.",
  "Reminder: This is a formal reminder regarding your outstanding payment.",
  "Urgent: Your payment is significantly overdue. Please settle this immediately to avoid service disruption."
];

const startReminderCron = () => {
  // Run every day at 10 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('Running daily reminder cron job...');
    
    try {
      const pendingInvoices = inMemoryInvoices.filter(inv => inv.status === 'Pending');
      
      for (const invoice of pendingInvoices) {
        const toneIndex = Math.min(invoice.reminderCount, reminderTones.length - 1);
        const message = reminderTones[toneIndex];
        
        console.log(`Sending reminder to ${invoice.clientName}: "${message}"`);
        
        // Update reminder count
        invoice.reminderCount += 1;
      }
    } catch (error) {
      console.error('Error in reminder cron job:', error);
    }
  });
  
  console.log('Reminder cron job scheduled.');
};

module.exports = startReminderCron;
