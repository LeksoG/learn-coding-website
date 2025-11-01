// Place this file in: /api/email-config.js

export default function handler(req, res) {
  // Set CORS headers to allow requests from your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get environment variables
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId2FA = process.env.EMAILJS_TEMPLATE_2FA;
  const templateIdReset = process.env.EMAILJS_TEMPLATE_RESET;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  // Check if all required variables are set
  const isConfigured = !!(serviceId && templateId2FA && publicKey);

  if (isConfigured) {
    // Return configuration if all variables are present
    res.status(200).json({
      configured: true,
      config: {
        serviceId: serviceId,
        templateId2FA: templateId2FA,
        templateIdReset: templateIdReset || templateId2FA, // Fallback to 2FA template if reset not set
        publicKey: publicKey
      }
    });
  } else {
    // Return not configured if variables are missing
    res.status(200).json({
      configured: false,
      message: 'EmailJS environment variables not set',
      missing: {
        serviceId: !serviceId,
        templateId2FA: !templateId2FA,
        publicKey: !publicKey
      }
    });
  }
}





