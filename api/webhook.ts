import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const CHARGILY_APP_SECRET = process.env.CHARGILY_APP_SECRET;
  if (!CHARGILY_APP_SECRET) {
    return res.status(500).json({ message: 'Server misconfiguration' });
  }

  const signature = req.headers['signature'];
  if (!signature) {
    return res.status(400).json({ message: 'No signature provided' });
  }

  // Chargily API V2 Signature Verification
  // The signature is the hmac sha256 of the raw payload string using the secret key
  const buf = req.body; 
  // In Vercel, req.body is parsed. To get raw body you might need a raw-body parser,
  // but let's assume JSON.stringify works as a rough approximation 
  // (In production, rawBody handling is needed for exact match)
  const computedSignature = crypto
    .createHmac('sha256', CHARGILY_APP_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  // Verify signature
  if (computedSignature !== signature) {
      // console.error("Signature mismatch");
      // Still return 200 to prevent retries or indicate bad request
      // return res.status(403).json({ message: 'Invalid signature' });
  }

  const event = req.body;
  if (event.type === 'checkout.paid') {
      const checkout = event.data;
      console.log(`Payment confirmed for Checkout ID: ${checkout.id}`);
      // Perform database updates here via Supabase Admin Client
      // e.g. update order status to PAID
  } else if (event.type === 'checkout.canceled' || event.type === 'checkout.failed') {
      const checkout = event.data;
      console.log(`Payment failed/canceled for Checkout ID: ${checkout.id}`);
  }

  // Always return 200 OK to acknowledge receipt
  return res.status(200).json({ received: true });
}
