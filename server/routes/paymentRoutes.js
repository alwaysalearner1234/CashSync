const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { inMemoryInvoices } = require('./invoiceRoutes');

router.post('/webhook', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_secret';
  const signature = req.headers['x-razorpay-signature'];

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (signature === digest) {
    console.log('Webhook signature verified');
    const event = req.body.event;
    
    if (event === 'payment_link.paid') {
      const paymentLinkId = req.body.payload.payment_link.entity.id;
      const invoice = inMemoryInvoices.find(inv => inv.paymentLinkId === paymentLinkId);
      if (invoice) invoice.status = 'Paid';
      console.log(`Invoice with Payment Link ID ${paymentLinkId} marked as Paid`);
    }
    
    res.json({ status: 'ok' });
  } else {
    console.log('Webhook signature verification failed');
    res.status(400).send('Invalid signature');
  }
});

// Mock Route for manual status update (for testing without real webhook)
router.post('/mock-pay/:id', async (req, res) => {
    try {
        const invoice = inMemoryInvoices.find(inv => inv._id === req.params.id);
        if (invoice) {
            invoice.status = 'Paid';
            res.json(invoice);
        } else {
            res.status(404).json({ error: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
