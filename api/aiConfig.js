export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, test } = req.body || {};

  // ✅ Handle test requests from aiConfig.js
  if (test) {
    return res.status(200).json({ response: "Test OK - Mistral endpoint is live" });
  }

  // Validate prompt input
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing MISTRAL_API_KEY in environment variables");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    // ✅ Use native fetch (Vercel runtime-safe)
    const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!mistralResponse.ok) {
      const errText = await mistralResponse.text();
      console.error("Mistral API error:", errText);
      return res.status(500).json({ error: "Mistral API request failed", details: errText });
    }

    const data = await mistralResponse.json();
    const reply = data?.choices?.[0]?.message?.content || "No response from model";

    return res.status(200).json({ response: reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
