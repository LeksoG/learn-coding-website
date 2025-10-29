# Mistral AI Integration Setup Guide

This guide explains how to set up Mistral AI for the AI Code Helper feature.

## Prerequisites

- A Mistral AI account (sign up at https://console.mistral.ai/)
- A Vercel account for deployment
- Your Mistral API key

## Setup Steps

### 1. Get Your Mistral API Key

1. Go to https://console.mistral.ai/
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key or copy an existing one
5. Save your API key securely

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to https://vercel.com/
3. Click "New Project"
4. Import your repository
5. Go to "Settings" → "Environment Variables"
6. Add a new environment variable:
   - **Name**: `MISTRAL_API_KEY`
   - **Value**: Your Mistral API key from step 1
   - **Environments**: Select all (Production, Preview, Development)
7. Click "Save"
8. Redeploy your project

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy your project
vercel

# Add environment variable
vercel env add MISTRAL_API_KEY

# Paste your Mistral API key when prompted
# Select all environments (production, preview, development)

# Redeploy to apply changes
vercel --prod
```

### 3. Verify Installation

After deployment:

1. Open your website
2. Open the browser console (F12)
3. Go to the Practice section
4. Click "AI Helper" button
5. Check the console for these messages:

```
✅ AI Config: Mistral AI endpoint configured
📍 Endpoint: /api/ai-chat
🤖 Model: mistral-small-latest
✨ Provider: Mistral AI
✅ AI is ready to use
```

### 4. Test the AI

1. Type a question in the AI input: "How do I use loops?"
2. Click the send button or press Enter
3. You should receive a response from Mistral AI

## Troubleshooting

### AI Not Working (Fallback Mode)

If you see this in console:
```
⚠️ AI Config: Using fallback mode (API not available)
💡 To enable Mistral AI: Deploy to Vercel with MISTRAL_API_KEY environment variable
```

**Solutions:**
- Make sure you've added `MISTRAL_API_KEY` to Vercel environment variables
- Redeploy your project after adding the environment variable
- Check that the API key is correct and has not expired
- Verify the API key has the necessary permissions

### API Key Not Found Error

If you see:
```
❌ MISTRAL_API_KEY not found in environment variables
```

**Solutions:**
- Add the `MISTRAL_API_KEY` environment variable in Vercel settings
- Make sure to select all environments when adding the variable
- Redeploy the project

### API Rate Limits

Mistral AI has rate limits based on your plan:
- Free tier: Limited requests per minute
- Paid tiers: Higher rate limits

If you hit rate limits:
- Wait a few moments before trying again
- Consider upgrading your Mistral AI plan
- Implement request caching (advanced)

## Configuration Options

You can customize the AI behavior in `aiConfig.js`:

```javascript
const AI_CONFIG = {
    endpoint: '/api/ai-chat',
    model: 'mistral-small-latest', // or 'mistral-medium', 'mistral-large-latest'
    maxTokens: 500, // Maximum response length
    temperature: 0.7, // Creativity level (0.0 - 1.0)
    // ... other settings
};
```

### Available Mistral Models

- `mistral-small-latest`: Fast and efficient for simple queries
- `mistral-medium`: Balanced performance and capability
- `mistral-large-latest`: Most capable model for complex tasks

## Features

### Language Detection
The AI automatically detects the programming language you're using and provides relevant suggestions.

### Smart Suggestions
Click on suggestion chips to quickly ask common questions for your current language.

### Conversation History
Chat-style interface maintains context within the sidebar session.

## Cost Considerations

- Mistral AI charges per token (input + output)
- Each request costs approximately $0.0002 - $0.002 depending on the model
- Monitor your usage in the Mistral AI console
- Set up billing alerts to avoid unexpected charges

## Privacy & Security

- Your API key is stored securely in Vercel environment variables
- Never commit API keys to your repository
- API calls are made server-side through the Vercel function
- User questions are sent to Mistral AI for processing

## Support

For issues:
- Mistral AI: https://docs.mistral.ai/
- Vercel: https://vercel.com/docs
- This project: Check GitHub issues

## Advanced: Local Development

To test locally with Mistral AI:

1. Create `.env.local` file in project root:
```
MISTRAL_API_KEY=your_api_key_here
```

2. Install Vercel CLI and run:
```bash
vercel dev
```

3. Your local server will have access to environment variables

**Note:** Never commit `.env.local` to version control!
