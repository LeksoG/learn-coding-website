export default async function handler(req, res) {
  try {
    // Log that the function is actually running
    console.log("✅ Serverless function called.");

    // Check environment variable
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      console.error("❌ MISTRAL_API_KEY is missing");
      return res.status(500).json({ error: "MISTRAL_API_KEY is not set on Vercel." });
    }

    // Just return success without calling Mistral yet
    return res.status(200).json({
      message: "Function is running correctly ✅",
      apiKeyLoaded: true
    });

  } catch (err) {
    console.error("❌ Serverless function crashed:", err);
    return res.status(500).json({ error: "Serverless function crashed", details: err.message });
  }
}
