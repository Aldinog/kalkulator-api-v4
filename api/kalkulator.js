
import { config } from 'dotenv';
config();

import { calculatePips, sendTelegramMessage } from '../utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { pair, op, harga } = req.body;
  if (!pair || !op || !harga) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const { formatted, message } = calculatePips(pair, op, parseFloat(harga));
  await sendTelegramMessage(message);
  res.status(200).json({ hasil: formatted });
}
