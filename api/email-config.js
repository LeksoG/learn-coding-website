// api/email-config.js
export default function handler(req, res) {
  res.status(200).json({
    EMAIL_SERVICE_ID: process.env.EMAIL_SERVICE_ID,
    EMAIL_TEMPLATE_ID: process.env.EMAIL_TEMPLATE_ID, // For password reset
    EMAIL_GOAL_TEMPLATE_ID: process.env.EMAIL_GOAL_TEMPLATE_ID, // NEW: For goal reminders
    EMAIL_PUBLIC_KEY: process.env.EMAIL_PUBLIC_KEY
  });
}

