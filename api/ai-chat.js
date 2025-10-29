import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "No response";
    res.status(200).json({ response: reply });
  } catch (error) {
    console.error("Mistral API Error:", error.response?.data || error.message);

    // Return readable error for debugging
    res.status(500).json({
      error: "Failed to connect to Mistral AI",
      details: error.response?.data || error.message,
      hint: "Check if your MISTRAL_API_KEY is valid and set correctly in Vercel",
    });
  }
}
