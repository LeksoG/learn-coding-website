import axios from "axios";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    // Send request to Mistral AI API
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small-latest", // You can switch to mistral-medium or mistral-large if you prefer
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the model’s reply
    const reply = response.data.choices?.[0]?.message?.content || "No response";

    // Send it back to the browser
    res.status(200).json({ response: reply });
  } catch (error) {
    console.error("Mistral API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to connect to Mistral AI",
      details: error.response?.data || error.message,
    });
  }
}
