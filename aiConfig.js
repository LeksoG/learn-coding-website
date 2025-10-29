// AI Configuration
const AI_CONFIG = {
    endpoint: '/api/ai-chat', // Vercel serverless function endpoint
    model: 'mistral-small-latest', // Mistral AI model
    maxTokens: 500,
    temperature: 0.7,

    // Language-specific suggestions
    suggestions: {
        'Python': [
            'How do I use loops?',
            'Explain list comprehension',
            'What are decorators?',
            'Help with file handling'
        ],
        'JavaScript': [
            'How do promises work?',
            'Explain async/await',
            'What is closure?',
            'Help with array methods'
        ],
        'Java': [
            'Explain inheritance',
            'What are interfaces?',
            'Help with collections',
            'How do generics work?'
        ],
        'React': [
            'How do hooks work?',
            'Explain useState',
            'Help with useEffect',
            'What is context API?'
        ],
        'HTML/CSS': [
            'How to center a div?',
            'Explain flexbox',
            'Help with grid layout?',
            'What is responsive design?'
        ]
    }
};

// ✅ Check if AI API is ready
async function initializeAI() {
    try {
        // Send test request to API
        const response = await fetch(AI_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ test: true })
        });

        if (response.ok) {
            console.log('✅ AI Config: Mistral AI endpoint configured');
            console.log('📍 Endpoint:', AI_CONFIG.endpoint);
            console.log('🤖 Model:', AI_CONFIG.model);
            console.log('✨ Provider: Mistral AI');
            console.log('✅ AI is ready to use');
            return true;
        } else {
            const text = await response.text();
            console.warn('⚠️ AI Config: API endpoint not responding correctly');
            console.warn('Response:', text);
            return false;
        }
    } catch (error) {
        console.warn('⚠️ AI Config: Using fallback mode (API not available)');
        console.log('💡 To enable Mistral AI: Deploy to Vercel with MISTRAL_API_KEY environment variable');
        return false;
    }
}

// ✅ Call AI API
async function callAI(message, language) {
    try {
        // Send properly formatted request (backend expects "prompt")
        const response = await fetch(AI_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `${language ? `[${language}] ` : ''}${message}`,
                model: AI_CONFIG.model,
                maxTokens: AI_CONFIG.maxTokens,
                temperature: AI_CONFIG.temperature
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('❌ AI API returned error:', errText);
            throw new Error('API call failed');
        }

        const data = await response.json();
        console.log('✅ AI Response received');
        return data.response;
    } catch (error) {
        console.warn('⚠️ Using fallback response (API not available)');
        return getFallbackResponse(message, language);
    }
}

// ✅ Fallback responses when API unavailable
function getFallbackResponse(message, language) {
    const fallbacks = {
        'Python': `Great question about Python! ${message} - In Python, remember to use proper indentation and follow PEP 8 style guidelines. Try breaking down your problem into smaller functions and test each part.`,
        'JavaScript': `Excellent JavaScript question! ${message} - Make sure to understand asynchronous programming, use const/let instead of var, and leverage ES6+ features for cleaner code.`,
        'Java': `Good Java question! ${message} - Remember to follow object-oriented principles, use interfaces for abstraction, and handle exceptions properly.`,
        'React': `Great React question! ${message} - Focus on component reusability, use hooks effectively, and remember that state updates are asynchronous.`,
        'HTML/CSS': `Nice question about HTML/CSS! ${message} - Use semantic HTML, leverage flexbox and grid for layouts, and make your designs responsive with media queries.`
    };

    return fallbacks[language] || `Thanks for your question: "${message}". I'm here to help with ${language || "your topic"}! Try breaking down the problem and testing step by step.`;
}

// ✅ Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAI);
} else {
    initializeAI();
}
