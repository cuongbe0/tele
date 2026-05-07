const BOT_TOKEN = "cuongbe0_BOT";
const CHAT_ID = "700636974";

let lastTurbo = 0;
let lastPnic = 0;

async function sendTelegram(message){

  const url =
  `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  await fetch(url,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      chat_id:CHAT_ID,
      text:message
    })
  });
}

async function checkPrices(){

  try{

    // TURBO
    const turboRes = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=TURBOUSDT"
    );

    const turboData = await turboRes.json();

    const turboPrice =
      parseFloat(turboData.price);

    // PNIC
    const pnicRes = await fetch(
      "https://api.dexscreener.com/latest/dex/tokens/0x8d87f8ac6d8df2f0d4f3d4b77e0d4c2615d9f7f1"
    );

    const pnicData = await pnicRes.json();

    const pnicPrice =
      parseFloat(pnicData.pairs[0].priceUsd);

    // ALERT TURBO
    if(lastTurbo !== 0){

      const turboChange =
      ((turboPrice - lastTurbo) / lastTurbo) * 100;

      if(Math.abs(turboChange) >= 3){

        await sendTelegram(
`🚀 TURBO ALERT

Price: $${turboPrice}

Change: ${turboChange.toFixed(2)}%`
        );
      }
    }

    // ALERT PNIC
    if(lastPnic !== 0){

      const pnicChange =
      ((pnicPrice - lastPnic) / lastPnic) * 100;

      if(Math.abs(pnicChange) >= 3){

        await sendTelegram(
`🔥 PNIC ALERT

Price: $${pnicPrice}

Change: ${pnicChange.toFixed(2)}%`
        );
      }
    }

    lastTurbo = turboPrice;
    lastPnic = pnicPrice;

  }catch(err){

    console.log(err);
  }
}

checkPrices();
