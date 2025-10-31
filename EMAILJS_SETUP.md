# EmailJS Setup Guide for 2FA

This guide will help you set up EmailJS to send real verification emails for 2FA.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add an Email Service

1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection steps
5. **Copy your Service ID** (e.g., `service_abc1234`)

## Step 3: Create Email Templates

### 2FA Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Name it: `2FA Verification Code`
4. Use this template:

```
Subject: Your 2FA Verification Code

Hello {{to_name}},

Your verification code for Code Academy is:

{{verification_code}}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
{{from_name}}
```

5. **Copy the Template ID** (e.g., `template_xyz5678`)

### Password Reset Template (Optional)

1. Create another template for password reset
2. Name it: `Password Reset Code`
3. Use similar format with `{{verification_code}}`
4. **Copy the Template ID**

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abcDEF123xyz456`)
3. Copy it

## Step 5: Update the Configuration

Open `script.js` and update the `EMAILJS_CONFIG` object at the top:

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'service_abc1234',      // Your Service ID from Step 2
    templateId2FA: 'template_xyz5678',  // Your 2FA Template ID from Step 3
    templateIdReset: 'template_reset123', // Your Reset Template ID (optional)
    publicKey: 'abcDEF123xyz456'       // Your Public Key from Step 4
};
```

## Step 6: Test It!

1. Save the file
2. Refresh your webpage
3. Enable 2FA in Settings
4. Log out and log back in
5. You should receive a real email with the verification code!

## Development Mode

If you haven't configured EmailJS yet, the app will run in **Development Mode**:
- A popup will show the verification code on screen
- This allows you to test 2FA without email setup
- Perfect for local development!

## Troubleshooting

### No emails arriving?

1. **Check spam folder** - Sometimes emails go there
2. **Verify email service** - Make sure your email service is connected in EmailJS
3. **Check console** - Look for error messages in browser console
4. **Free tier limits** - EmailJS free tier has 200 emails/month

### Emails not sending?

1. **Check Public Key** - Make sure it's correct in `EMAILJS_CONFIG`
2. **Template variables** - Ensure template uses: `{{to_email}}`, `{{to_name}}`, `{{verification_code}}`, `{{from_name}}`
3. **Service ID** - Verify the service ID matches your EmailJS dashboard

## Free Tier Limits

EmailJS Free Plan includes:
- ✅ 200 emails per month
- ✅ 2 email services
- ✅ Unlimited templates
- ✅ Email tracking

Perfect for a learning website! 🚀

## Need Help?

- EmailJS Documentation: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/support/

---

**Note:** Keep your Public Key safe but remember it's meant to be used in frontend code. For production apps with sensitive data, consider using a backend API instead.
