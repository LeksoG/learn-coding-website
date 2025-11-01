export default function handler(req, res) {
  res.status(200).json({
    configured: true,
    config: {
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId2FA: process.env.EMAILJS_TEMPLATE_2FA,
      templateIdReset: process.env.EMAILJS_TEMPLATE_RESET,
      publicKey: process.env.EMAILJS_PUBLIC_KEY
    }
  });
}




