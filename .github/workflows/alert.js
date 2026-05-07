import fs from 'fs';

const BOT_TOKEN =
"8614060040:AAEnvPS3qrgHKaYiuX1EE_U3NyEGdveFG64";

const CHAT_ID =
"700636974";

const FILE =
"prices.json";

// ====================
// SEND TELEGRAM
// ====================

async function sendTelegram(message){

    const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                chat_id:CHAT_ID,
                text:message
            })
        }
    );

    const data = await res.json();

    console.log(data);
}

// ====================
// LOAD PRICE
// ====================

function loadPrices(){

    try{

        const data =
        fs.readFileSync(FILE,'utf8');

        return JSON.parse(data);

    }catch{

        return {
            turbo:0,
            pnic:0
        };
    }
}

// ====================
// SAVE PRICE
// ====================

function savePrices(turbo,pnic){

    fs.writeFileSync(
        FILE,
        JSON.stringify({
            turbo,
            pnic
        })
    );
}

// ====================
// MAIN
// ====================

async function run(){

    try{

        const old =
        loadPrices();

        // ====================
        // TURBO
        // ====================

        const turboRes =
        await fetch(
            'https://api.binance.com/api/v3/ticker/price?symbol=TURBOUSDT'
        );

        const turboData =
        await turboRes.json();

        const turbo =
        Number(turboData.price);

        // ====================
        // PNIC
        // ====================

        const pnicRes =
        await fetch(
            'https://mqeejpeekuzzygwabmnh.supabase.co/rest/v1/price_snapshots?select=pnic_price_usd&order=timestamp.desc&limit=1',
            {
                headers:{
                    apikey:
                    'sb_publishable__EFtt8r3kAP6zwWT0Ze38w_zktfLWuv'
                }
            }
        );

        const pnicData =
        await pnicRes.json();

        const pnic =
        Number(
            pnicData[0].pnic_price_usd
        );

        console.log("TURBO:", turbo);
        console.log("PNIC:", pnic);

        // ====================
        // TEST MESSAGE
        // ====================

        await sendTelegram(

`✅ BOT RUNNING

TURBO: $${turbo}

PNIC: $${pnic}`

        );

        // SAVE PRICE
        savePrices(turbo,pnic);

        console.log('DONE');

    }catch(e){

        console.log(e);
    }
}

run();
