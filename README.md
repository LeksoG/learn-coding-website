# Learn Coding Website - Local Development Guide

## 🚀 Running the Project Locally

### ⚠️ Important: Don't Open HTML Files Directly!

If you're seeing a **404 error for aiConfig.js**, it's because you're opening `index.html` directly in your browser (using `file://` protocol). This causes issues with loading JavaScript modules.

### ✅ Correct Way to Run Locally

You need to run a local web server. Here are several easy options:

#### Option 1: Using Python (Recommended for Beginners)

**Python 3:**
```bash
cd /path/to/learn-coding-website
python -m http.server 8000
```

**Python 2:**
```bash
cd /path/to/learn-coding-website
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

#### Option 2: Using Node.js

**Install and run `http-server`:**
```bash
npm install -g http-server
cd /path/to/learn-coding-website
http-server -p 8000
```

Then open: `http://localhost:8000`

#### Option 3: Using VS Code

If you use VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. It will automatically open in your browser

#### Option 4: Using PHP

If you have PHP installed:
```bash
cd /path/to/learn-coding-website
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 🔍 Troubleshooting

### Error: "aiConfig.js:1 Failed to load resource: 404"

**Cause:** Opening HTML file directly in browser

**Solution:** Use one of the web server methods above

### Error: "Identifier 'currentLanguage' has already been declared"

**Status:** ✅ Fixed in latest commit

**What was done:** Renamed the AI sidebar's language variable to `aiCurrentLanguage` to avoid conflicts

### Console shows: "⚠️ AI_CONFIG not loaded"

**Cause:** aiConfig.js didn't load properly

**Solutions:**
1. Make sure you're running a web server (see above)
2. Clear your browser cache (Ctrl+Shift+Delete)
3. Do a hard refresh (Ctrl+F5 or Cmd+Shift+R)

### AI Not Working (Fallback Mode)

**Expected behavior locally:** You'll see fallback responses because the Mistral API is only available when deployed to Vercel

**Console message:**
```
⚠️ AI Config: Using fallback mode (API not available)
💡 To enable Mistral AI: Deploy to Vercel with MISTRAL_API_KEY environment variable
```

**To enable real AI:** See [MISTRAL_AI_SETUP.md](./MISTRAL_AI_SETUP.md)

## 📝 Verification Checklist

When running correctly, you should see in the console:

```
✅ AI Config: Mistral AI endpoint configured
📍 Endpoint: /api/ai-chat
🤖 Model: mistral-small-latest
✨ Provider: Mistral AI
```

If you see the fallback message instead, that's fine for local development!

## 🌐 Deploying to Production

For production deployment with real AI:

1. Push your code to GitHub
2. Deploy to Vercel
3. Add `MISTRAL_API_KEY` environment variable
4. See detailed instructions in [MISTRAL_AI_SETUP.md](./MISTRAL_AI_SETUP.md)

## 📱 Testing Features

### Bar Chart
- Navigate to Home section
- Check that bars align perfectly to their percentages
- Bars should touch the zero line at the bottom

### AI Code Helper (Practice Section)
1. Go to Practice page
2. Click "AI Helper" button
3. Type code in the editor
4. See language-specific suggestions appear
5. Ask questions using the oval input at the bottom
6. Get responses (fallback mode locally, real AI when deployed)

## 🛠️ File Structure

```
learn-coding-website/
├── index.html          # Main HTML file
├── style.css           # All styles
├── script.js           # Main JavaScript
├── aiConfig.js         # AI configuration (must load before script.js)
├── lessonContent.js    # Course lesson content
├── api/
│   └── ai-chat.js      # Vercel serverless function for Mistral AI
└── MISTRAL_AI_SETUP.md # AI setup instructions
```

## 💡 Quick Tips

- **Always use a web server** for local development
- **Hard refresh** (Ctrl+F5) if you see old code
- **Check console** for helpful error messages
- **Fallback mode is normal** when running locally
- **Real AI only works** when deployed to Vercel with API key

## 🐛 Still Having Issues?

1. Clear browser cache completely
2. Try a different browser
3. Check browser console for specific errors
4. Make sure all files are in the correct locations
5. Verify you're using a web server, not opening files directly

## 📚 Additional Resources

- [Mistral AI Documentation](https://docs.mistral.ai/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [MISTRAL_AI_SETUP.md](./MISTRAL_AI_SETUP.md) - Full AI setup guide
