import fs from 'fs';

const BOT_TOKEN =
"cuongbe0_BOT";

const CHAT_ID =
"700636974";

const FILE =
"prices.json";

// ====================
// TELEGRAM
// ====================

async function sendTelegram(message){

    await fetch(
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
}

// ====================
// LOAD OLD PRICE
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

        // ====================
        // TURBO ALERT
        // ====================

        if(old.turbo !== 0){

            const turboChange =
            ((turbo-old.turbo)/old.turbo)*100;

            if(Math.abs(turboChange)>=1){

                await sendTelegram(

`🚀 TURBO ALERT

Price: $${turbo}

Change: ${turboChange.toFixed(2)}%`

                );
            }
        }

        // ====================
        // PNIC ALERT
        // ====================

        if(old.pnic !== 0){

            const pnicChange =
            ((pnic-old.pnic)/old.pnic)*100;

            if(Math.abs(pnicChange)>=1){

                await sendTelegram(

`🔥 PNIC ALERT

Price: $${pnic}

Change: ${pnicChange.toFixed(2)}%`

                );
            }
        }

        // SAVE NEW PRICE
        savePrices(turbo,pnic);

        console.log('DONE');

    }catch(e){

        console.log(e);
    }
}

run();
