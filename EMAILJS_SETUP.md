# EmailJS Setup Guide for 2FA & Password Reset

This guide will help you set up EmailJS to send real verification emails.

## Overview

The system sends **two different types of emails**:

1. **2FA Login Verification** (5-digit code)
   - Sent when users log in with 2FA enabled
   - Uses template: `EMAILJS_TEMPLATE_2FA`

2. **Password Reset** (6-digit code)
   - Sent when users click "Forgot Password"
   - Uses template: `EMAILJS_TEMPLATE_RESET`

Both use the same EmailJS service and public key, but different templates for better security and user experience.

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

**IMPORTANT:** You need **TWO SEPARATE TEMPLATES** - one for 2FA login and one for password reset.

### Template 1: 2FA Login Verification (5-digit code)

This sends a **5-digit code** when users log in with 2FA enabled.

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Name it: `2FA Login Verification`
4. Use this template:

```
Subject: Your 2FA Login Code for Code Academy

Hello {{to_name}},

Your 2FA login verification code is:

{{verification_code}}

This code will expire in 10 minutes.

If you didn't request this code, please secure your account immediately.

Best regards,
{{from_name}}
```

5. **Copy the Template ID** (e.g., `template_2fa_abc123`)
6. Save this as `EMAILJS_TEMPLATE_2FA` in Vercel

### Template 2: Password Reset (6-digit code)

This sends a **6-digit code** when users request a password reset.

1. Create **another new template**
2. Name it: `Password Reset Code`
3. Use this template:

```
Subject: Reset Your Code Academy Password

Hello {{to_name}},

You requested to reset your password. Your verification code is:

{{verification_code}}

This code will expire in 10 minutes.

If you didn't request this, please ignore this email - your password will remain unchanged.

Best regards,
{{from_name}}
```

4. **Copy the Template ID** (e.g., `template_reset_xyz789`)
5. Save this as `EMAILJS_TEMPLATE_RESET` in Vercel

**Why two templates?**
- Different email subjects help users identify why they're receiving a code
- 2FA codes are 5 digits, reset codes are 6 digits
- Different security contexts require different messaging

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abcDEF123xyz456`)
3. Copy it

## Step 5: Set Up Environment Variables in Vercel

For security, EmailJS credentials are stored in Vercel environment variables (not hardcoded in the script).

### Option A: Deploy to Vercel (Recommended)

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add the following **4 required variables**:

| Variable Name | Example Value | Description | Used For |
|--------------|---------------|-------------|----------|
| `EMAILJS_SERVICE_ID` | `service_abc1234` | Your Service ID from Step 2 | Both email types |
| `EMAILJS_TEMPLATE_2FA` | `template_2fa_abc123` | **2FA Template** ID (5-digit code) | Login with 2FA |
| `EMAILJS_TEMPLATE_RESET` | `template_reset_xyz789` | **Password Reset Template** ID (6-digit code) | Forgot password |
| `EMAILJS_PUBLIC_KEY` | `abcDEF123xyz456` | Your Public Key from Step 4 | Both email types |

4. Click **Save** for each variable
5. **Redeploy your application** (or trigger a new deployment)

⚠️ **Important:**
- `EMAILJS_TEMPLATE_2FA` and `EMAILJS_TEMPLATE_RESET` must be **different template IDs**
- Each template has different content and subject lines
- The system automatically uses the correct template based on user action

### Option B: Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your values:
   ```
   EMAILJS_SERVICE_ID=service_abc1234
   EMAILJS_TEMPLATE_2FA=template_xyz5678
   EMAILJS_TEMPLATE_RESET=template_reset123
   EMAILJS_PUBLIC_KEY=abcDEF123xyz456
   ```

3. Make sure `.env.local` is in your `.gitignore` (never commit it!)

## Step 6: How It Works

The application uses a Vercel serverless function (`/api/email-config.js`) to securely fetch EmailJS credentials from environment variables. Your keys are never exposed in the frontend code.

When configured properly:
- Script fetches config from `/api/email-config` endpoint
- EmailJS sends real verification emails
- Your credentials remain secure server-side

## Step 7: Test It!

1. Deploy to Vercel or run locally with environment variables set
2. Open your website
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
