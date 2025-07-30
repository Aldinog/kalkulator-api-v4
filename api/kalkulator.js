const { calculatePips, sendTelegramMessage } = require('../utils.js');

module.exports = async (req, res) => {
  // Tambahkan header CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://web-aplikation-git-main-aldino-satrias-projects.vercel.app/');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Tangani preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
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
