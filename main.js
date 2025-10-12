fetch('/api/email-config')
  .then(res => res.json())
  .then(config => {
    const EMAIL_CONFIG = {
      serviceId: config.EMAIL_SERVICE_ID,
      templateId: config.EMAIL_TEMPLATE_ID,
      publicKey: config.EMAIL_PUBLIC_KEY
    };

    if (EMAIL_CONFIG.publicKey) {
      emailjs.init(EMAIL_CONFIG.publicKey);
      console.log("✅ EmailJS configured successfully");
    } else {
      console.warn("⚠️ EmailJS not configured - password reset will not work");
    }
  })
  .catch(err => console.error("Error fetching EmailJS config:", err));