// api/email-config.js
// Vercel serverless function to securely provide EmailJS configuration
export default function handler(req, res) {
  // Read EmailJS configuration from environment variables
  const config = {
    serviceId: process.env.EMAILJS_SERVICE_ID || null,
    templateId2FA: process.env.EMAILJS_TEMPLATE_2FA || null,
    templateIdReset: process.env.EMAILJS_TEMPLATE_RESET || null,
    publicKey: process.env.EMAILJS_PUBLIC_KEY || null
  };

  // Check if all required variables are configured
  const isConfigured = config.serviceId && config.templateId2FA && config.publicKey;

  // Only return config if properly configured, otherwise return null
  res.status(200).json({
    configured: isConfigured,
    config: isConfigured ? config : null
  });
}

