const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency = 'INR', receipt } = req.body || {};

  if (!amount || typeof amount !== 'number' || !Number.isInteger(amount) || amount < 100) {
    return res.status(400).json({ error: 'amount must be an integer in paise, at least 100 (₹1)' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(401).json({ error: 'Razorpay credentials are not configured on the server' });
  }

  const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await instance.orders.create({
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    return res.status(500).json({ error: 'Could not create order' });
  }
};
