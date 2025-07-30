const { calculatePips, sendTelegramMessage } = require('../utils.js');

module.exports = async (req, res) => {
  // Tambahkan header CORS
 const allowedOrigins = [
  'https://web-aplikation.vercel.app',
  'https://web-aplikation-git-main-aldino-satrias-projects.vercel.app'
];

const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}

  // Tangani preflight OPTIONS request
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
  return res.status(200).end();
}

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Api menyala, tetapi kamu menggunakan method selain POST' });
  }

  const { pair, op, harga } = req.body;
  if (!pair || !op || !harga) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const { formatted, message } = calculatePips(pair, op, parseFloat(harga));
    await sendTelegramMessage(message);
    res.status(200).json({ hasil: formatted });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: 'Terjadi kesalahan internal.' });
  }
};
