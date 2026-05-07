import fs from 'fs';

const BOT_TOKEN =
"8614060040:AAEnvPS3qrgHKaYiuX1EE_U3NyEGdveFG64";

const CHAT_ID =
"700636974";

const FILE =
"prices.json";

// ====================
// TELEGRAM
// ====================

async function sendTelegram(message){

    try{

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

    }catch(e){

        console.log(e);
    }
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
        // LOAD TURBO + PNIC
        // ====================

        const res =
        await fetch(
            'https://mqeejpeekuzzygwabmnh.supabase.co/rest/v1/price_snapshots?select=turbo_price_usd,pnic_price_usd&order=timestamp.desc&limit=1',
            {
                headers:{
                    apikey:
                    'sb_publishable__EFtt8r3kAP6zwWT0Ze38w_zktfLWuv'
                }
            }
        );

        const data =
        await res.json();

        const turbo =
        Number(
            data[0].turbo_price_usd
        );

        const pnic =
        Number(
            data[0].pnic_price_usd
        );

        console.log("TURBO:", turbo);
        console.log("PNIC:", pnic);

        // ====================
        // TURBO ALERT
        // ====================

        if(old.turbo !== 0){

            const turboChange =
            ((turbo-old.turbo)/old.turbo)*100;

            if(Math.abs(turboChange)>=0.5){

                let icon = '🚀';

                if(turboChange < 0){
                    icon = '📉';
                }

                await sendTelegram(

`${icon} TURBO ALERT

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

            if(Math.abs(pnicChange)>=0.5){

                let icon = '🚀';

                if(pnicChange < 0){
                    icon = '📉';
                }

                await sendTelegram(

`${icon} PNIC ALERT

Price: $${pnic}

Change: ${pnicChange.toFixed(2)}%`

                );
            }
        }

        // ====================
        // SAVE
        // ====================

        savePrices(turbo,pnic);

        console.log('DONE');

    }catch(e){

        console.log(e);
    }
}

run();
