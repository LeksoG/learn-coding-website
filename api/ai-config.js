export default function handler(req, res) {
  res.status(200).json({
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || ''
  });
}
