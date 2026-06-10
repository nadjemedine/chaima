import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const CHARGILY_APP_SECRET = process.env.CHARGILY_APP_SECRET;

  if (!CHARGILY_APP_SECRET) {
    return res.status(500).json({ success: false, message: 'Chargily secret key is missing.' });
  }

  const { amount, product_title, customer_name, customer_email, mode } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount.' });
  }

  try {
    const appUrl = process.env.VITE_APP_URL || process.env.APP_URL || "https://coachchaima.site";
    
    // Construct Chargily API V2 Checkout payload
    const payload = {
        amount: amount,
        currency: "dzd",
        success_url: `${appUrl}/success`,
        failure_url: `${appUrl}/`,
        webhook_endpoint: `${appUrl}/api/webhook`,
        description: product_title || "Coach Chaima Plans",
        metadata: [
            { customer_name: customer_name || "Unknown" },
            { customer_email: customer_email || "unknown@example.com" },
            { requested_mode: mode || "CIB" }
        ]
    };

    const response = await fetch("https://pay.chargily.net/api/v2/checkouts", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${CHARGILY_APP_SECRET}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error("Chargily API error:", errorData);
        return res.status(500).json({ success: false, message: 'فشل في إنشاء جلسة الدفع' });
    }

    const data = await response.json();
    
    return res.status(200).json({
        success: true,
        payment_url: data.checkout_url,
        payment_id: data.id,
        message: 'تم التوجيه للدفع'
    });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: 'تعذر الاتصال ببوابة الدفع',
    });
  }
}
