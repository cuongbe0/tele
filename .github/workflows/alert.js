const BOT_TOKEN =
"8614060040:AAEnvPS3qrgHKaYiuX1EE_U3NyEGdveFG64";

const CHAT_ID =
"700636974";

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

        console.log("TELEGRAM SENT");

    }catch(e){

        console.log(e);
    }
}

// ====================
// MAIN
// ====================

async function run(){

    try{

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
        // SEND TELEGRAM
        // ====================

        await sendTelegram(

`🚀 PRICE UPDATE

TURBO: $${turbo}

PNIC: $${pnic}`

        );

        console.log("DONE");

    }catch(e){

        console.log(e);
    }
}

run();
