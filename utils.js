const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function calculatePips(pair, op, harga) {
  const pairLower = pair.toLowerCase();

  // Tentukan jumlah angka di belakang koma
  let decimalPlaces = 5;
  if (pairLower.includes("jpy")) {
    decimalPlaces = 3;
  } else if (pairLower === "xauusd") {
    decimalPlaces = 2;
  }

  // Tentukan nilai pip
  let pip = 0.00010;
  if (pairLower.includes("jpy")) pip = 0.01;
  else if (pairLower === "xauusd") pip = 0.10;

  const entry = harga;
  const h = op === 'buy' ? harga - 20 * pip : harga + 20 * pip;
  const sl = op === 'buy' ? h - 35 * pip : h + 35 * pip;
  const tp1 = op === 'buy' ? harga + 20 * pip : harga - 20 * pip;
  const tp2 = op === 'buy' ? harga + 60 * pip : harga - 60 * pip;
  const tp3 = op === 'buy' ? harga + 100 * pip : harga - 100 * pip;

  const format = val => val.toFixed(decimalPlaces);

  const message = `📈 Pair: ${pair}
📌 ${op.toUpperCase()} NOW 🔥

Zona Entry: ${format(entry)} - ${format(h)}
❌ SL: ${format(sl)}
🎯 TP 1: ${format(tp1)}
🎯 TP 2: ${format(tp2)}
🎯 TP 3: ${format(tp3)}

NOTE:
⚠️ Harap selalu gunakan money management LOW RISK/BIJAK ⚠️`;

  return { formatted: message, message };
}

async function sendTelegramMessage(msg) {
  if (!TOKEN || !CHAT_ID) {
    console.error("❌ Token atau Chat ID belum diset.");
    return;
  }

  const chatIds = CHAT_ID.split(",").map(id => id.trim());
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  // Kirim semua pesan paralel
  const requests = chatIds.map(async (id) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: id,
          text: msg,
          parse_mode: "Markdown"
        })
      });

      const data = await res.json();

      if (data.ok) console.log(`✅ Pesan terkirim ke chat ID ${id}`);
      else console.error(`⚠️ Gagal kirim ke ${id}: ${data.description}`);
    } catch (err) {
      console.error(`❌ Error kirim ke ${id}: ${err.message}`);
    }
  });

  await Promise.all(requests);
  console.log("📤 Semua pesan telah diproses.");
}

module.exports = { calculatePips, sendTelegramMessage };
