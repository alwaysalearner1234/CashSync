const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Razorpay = require('razorpay');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
});

// In-memory storage for MVP fallback
let inMemoryInvoices = [];

// AI Parsing Route
router.post('/parse-text', async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      Extract invoice details from the following business conversation text.
      Text: "${text}"
      
      Return ONLY a JSON object with the following structure:
      {
        "clientName": "string",
        "items": [
          { "name": "string", "quantity": number, "price": number }
        ],
        "totalAmount": number
      }
      If information is missing, use reasonable defaults or empty strings.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonText = response.text().trim();
    
    // Clean up JSON if necessary (sometimes AI includes markdown code blocks)
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json|```/g, '').trim();
    }

    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (error) {
    console.error('AI Parsing Error:', error);
    // Mock response if API key is missing or fails
    res.status(500).json({ 
      error: 'AI parsing failed', 
      details: error.message,
      mock: {
        clientName: "Example Client",
        items: [{ name: "Service", quantity: 1, price: 1000 }],
        totalAmount: 1000
      }
    });
  }
});

// Create Invoice Route
router.post('/create', async (req, res) => {
  try {
    const { clientName, items, totalAmount } = req.body;

    // Create Razorpay Payment Link (Mock or Real)
    let paymentLinkId = 'plink_' + Math.random().toString(36).substr(2, 9);
    let paymentUrl = 'https://rzp.io/i/mock_link';

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_mock') {
      try {
        const paymentLink = await razorpay.paymentLink.create({
          amount: totalAmount * 100, // in paise
          currency: "INR",
          accept_partial: false,
          description: `Invoice for ${clientName}`,
          customer: {
            name: clientName,
            email: "client@example.com",
            contact: "+919999999999"
          },
          notify: {
            sms: true,
            email: true
          },
          reminder_enable: true,
          notes: {
            policy_name: "CashSync Payment"
          }
        });
        paymentLinkId = paymentLink.id;
        paymentUrl = paymentLink.short_url;
      } catch (err) {
        console.error('Razorpay Error:', err);
      }
    }

    const newInvoice = {
      _id: 'inv_' + Math.random().toString(36).substr(2, 9),
      clientName,
      items,
      totalAmount,
      paymentLinkId,
      paymentUrl,
      status: 'Pending',
      createdAt: new Date(),
      reminderCount: 0
    };

    inMemoryInvoices.unshift(newInvoice);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Invoices
router.get('/', async (req, res) => {
  try {
    res.json(inMemoryInvoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Stats
router.get('/stats', async (req, res) => {
  try {
    const paidInvoices = inMemoryInvoices.filter(inv => inv.status === 'Paid');
    const totalEarnings = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingCount = inMemoryInvoices.filter(inv => inv.status === 'Pending').length;

    res.json({
      totalEarnings: totalEarnings,
      pendingPayments: pendingCount,
      paidInvoices: paidInvoices.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, inMemoryInvoices };
