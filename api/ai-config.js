// /ai-config.js
export const MISTRAL_CONFIG = {
    apiUrl: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-small-latest',
    temperature: 0.7,
    maxTokens: 120
};

export async function getMistralExplanation(keyword, context) {
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
    
    if (!MISTRAL_API_KEY) {
        throw new Error('API key not configured');
    }

    const response = await fetch(MISTRAL_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
            model: MISTRAL_CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful programming tutor. Explain concepts in 2-3 sentences for beginners.'
                },
                {
                    role: 'user',
                    content: `Explain "${keyword}". Context: "${context}"`
                }
            ],
            temperature: MISTRAL_CONFIG.temperature,
            max_tokens: MISTRAL_CONFIG.maxTokens
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}
