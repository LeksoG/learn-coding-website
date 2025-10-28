// /api/ai-explain.js
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { keyword, context } = req.body;
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

    if (!MISTRAL_API_KEY) {
        console.error('MISTRAL_API_KEY not found');
        return res.status(500).json({ 
            error: 'API key not configured',
            explanation: `${keyword} is an important programming concept. Variables store data, functions perform tasks, and loops repeat code.`
        });
    }

    try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: 'mistral-small-latest',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful programming tutor. Explain programming concepts in 2-3 clear, concise sentences suitable for beginners. Be encouraging and use simple language. Keep it under 100 words.'
                    },
                    {
                        role: 'user',
                        content: `Explain the programming concept "${keyword}" in simple terms. ${context ? `Context: "${context.substring(0, 150)}"` : ''}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 120
            })
        });

        if (!response.ok) {
            throw new Error(`Mistral API error: ${response.status}`);
        }

        const data = await response.json();
        const explanation = data.choices[0].message.content;

        return res.status(200).json({ explanation });
    } catch (error) {
        console.error('Mistral API Error:', error);
        
        // Fallback explanations
        const fallbacks = {
            'variable': 'Variables are containers that store data values. Think of them as labeled boxes where you can put information and retrieve it later. You can change what\'s inside the box anytime!',
            'function': 'Functions are reusable blocks of code that perform specific tasks. Like a recipe, you define it once and can use it many times. They help keep your code organized and efficient.',
            'loop': 'Loops repeat code multiple times automatically. Instead of writing the same code 100 times, a loop does it for you! Common types include for loops and while loops.',
            'array': 'Arrays store multiple values in a single variable, organized by index numbers. Think of it as a numbered list where each item has a position starting from 0.',
            'string': 'Strings are sequences of characters used to represent text. Anything between quotes like "Hello World" is a string. You can combine, split, and manipulate them in many ways!',
        };
        
        return res.status(200).json({ 
            explanation: fallbacks[keyword.toLowerCase()] || `${keyword} is an important programming concept that helps you write better code. It's commonly used in many programming languages!`
        });
    }
}
