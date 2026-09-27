const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(401).json({ error: 'Razorpay credentials are not configured on the server' });
  }

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    // Do NOT mark as paid.
    return res.status(400).json({ verified: false, error: 'Signature mismatch' });
  }

  // Signature checks out — the payment is genuinely from Razorpay for this order.
  // If you add a database later, mark the subscription/order as paid here.
  return res.status(200).json({ verified: true });
};
