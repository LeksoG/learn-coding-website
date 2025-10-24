export default function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.MISTRAL_API_KEY;

    // Check if API key exists
    if (!apiKey) {
        console.error('❌ MISTRAL_API_KEY not found in environment variables');
        return res.status(500).json({ error: 'API key not configured in Vercel' });
    }

    console.log('✅ API key found, length:', apiKey.length);
    
    res.status(200).json({
        MISTRAL_API_KEY: apiKey
    });
}
