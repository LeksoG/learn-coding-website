// Vercel Serverless Function for Mistral AI Integration
// This file handles AI chat requests using Mistral AI API

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, language, model, maxTokens, temperature, test } = req.body;

        // Handle test request
        if (test) {
            return res.status(200).json({
                status: 'ok',
                message: 'Mistral AI endpoint is ready'
            });
        }

        // Get Mistral API key from environment variable
        const apiKey = process.env.MISTRAL_API_KEY;

        if (!apiKey) {
            console.error('❌ MISTRAL_API_KEY not found in environment variables');
            return res.status(500).json({
                error: 'API key not configured',
                message: 'Please add MISTRAL_API_KEY to your Vercel environment variables'
            });
        }

        console.log('✅ Mistral API key found');
        console.log('📨 Processing request for language:', language);
        console.log('💬 User message:', message);

        // Prepare the prompt with language context
        const systemPrompt = `You are a helpful coding assistant specializing in ${language}.
Provide clear, concise, and practical answers to programming questions.
Include code examples when relevant. Keep responses under 150 words.`;

        // Call Mistral AI API
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'mistral-small-latest',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: maxTokens || 500,
                temperature: temperature || 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Mistral API error:', errorData);
            throw new Error(`Mistral API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        console.log('✅ Mistral AI response received');
        console.log('📤 Response length:', aiResponse.length, 'characters');

        // Return the AI response
        return res.status(200).json({
            response: aiResponse,
            model: model || 'mistral-small-latest',
            language: language
        });

    } catch (error) {
        console.error('❌ Error in AI chat handler:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
