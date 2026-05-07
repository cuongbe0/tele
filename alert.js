const BOT_TOKEN = "cuongbe0_BOT";
const CHAT_ID = "700636974";

async function sendTelegram(message) {

    const url =
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
        })
    });
}

sendTelegram("🚀 GitHub Actions chạy thành công!");
