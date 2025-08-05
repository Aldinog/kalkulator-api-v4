
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;


function calculatePips(pair, op, harga) {

  const pipValues = {
  // Major (4 decimal pip)
  eurusd: 0.0001,
  gbpusd: 0.0001,
  audusd: 0.0001,
  usdcad: 0.0001,
  usdchf: 0.0001,
  nzdusd: 0.0001,
  eurgbp: 0.0001,
  eurcad: 0.0001,
  eurchf: 0.0001,
  gbpchf: 0.0001,
  audcad: 0.0001,
  audnzd: 0.0001,
  // JPY pairs (2 decimal pip)
  usdjpy: 0.01, 
  eurjpy: 0.01,
  gbpjpy: 0.01,
  audjpy: 0.01,
  nzdjpy: 0.01,
  // XAU/USD (gold)
  xauusd: 0.01,
};


const pip = pipValues[pair.toLowerCase()] || 0.0001;
let entry = harga;
let h = op === 'buy' ? harga - 20 * pip : harga + 20 * pip;
let sl = op === 'buy' ? harga - 35 * pip : harga + 35 * pip;
let tp1 = op === 'buy' ? harga + 20 * pip : harga - 20 * pip;
let tp2 = op === 'buy' ? harga + 60 * pip : harga - 60 * pip;
let tp3 = op === 'buy' ? harga + 100 * pip : harga - 100 * pip;

let decimalPlaces = pair.toLowerCase() === "xauusd" ? 2 : 3;

let format = harga.toFixed(decimalPlaces);
let hFormat = h.toFixed(decimalPlaces);
let tp1Format = tp1.toFixed(decimalPlaces);
let tp2Format = tp2.toFixed(decimalPlaces);
let tp3Format = tp3.toFixed(decimalPlaces);
let slFormat = sl.toFixed(decimalPlaces);

  const message = `📈 Pair: ${pair} \n📌 ${op.toUpperCase()} NOW 🔥\n
  Zona Entry: ${format} - ${hFormat}\n❌ SL: ${slFormat}\n🎯 TP 1: ${tp1Format}\n🎯 TP 2: ${tp2Format}\n🎯 TP 3: ${tp3Format} \n\n NOTE:\n ⚠️Harap selalu gunakan money management LOW RISK/BIJAK⚠️`;

  return { formatted: message, message };
}

async function sendTelegramMessage(msg) {
  if (!TOKEN || !CHAT_ID) {
    console.log("Token atau Chat ID belum diset.");
    return;
  }

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: "Markdown"
      })
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
}

module.exports = { calculatePips, sendTelegramMessage };





