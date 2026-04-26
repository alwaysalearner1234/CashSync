require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { router: invoiceRoutes } = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const startReminderCron = require('./services/reminderService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic health check
app.get('/', (req, res) => {
  res.send('CashSync API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startReminderCron();
});
