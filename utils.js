const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function calculatePips(pair, op, harga) {
  const pairLower = pair.toLowerCase();

  // Tentukan jumlah angka di belakang koma
  let decimalPlaces = 4;
  if (pairLower.includes("jpy")) {
    decimalPlaces = 3; // Output 3 angka koma untuk JPY
  } else if (pairLower === "xauusd") {
    decimalPlaces = 2;
  }

  // Tentukan nilai pip yang benar untuk perhitungan
  let pip = 0.0001;
  if (pairLower.includes("jpy")) {
    pip = 0.01; // Perhitungan pip JPY benar
  } else if (pairLower === "xauusd") {
    pip = 0.1; // Gold = 0.1 pip untuk 1 tick
  }

  const entry = harga;
  const h = op === 'buy' ? harga - 20 * pip : harga + 20 * pip;
  const sl = op === 'buy' ? harga - 35 * pip : harga + 35 * pip;
  const tp1 = op === 'buy' ? harga + 20 * pip : harga - 20 * pip;
  const tp2 = op === 'buy' ? harga + 60 * pip : harga - 60 * pip;
  const tp3 = op === 'buy' ? harga + 100 * pip : harga - 100 * pip;

  // Format output sesuai decimalPlaces
  const format = entry.toFixed(decimalPlaces);
  const hFormat = h.toFixed(decimalPlaces);
  const slFormat = sl.toFixed(decimalPlaces);
  const tp1Format = tp1.toFixed(decimalPlaces);
  const tp2Format = tp2.toFixed(decimalPlaces);
  const tp3Format = tp3.toFixed(decimalPlaces);

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

