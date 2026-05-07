const BOT_TOKEN =
"8614060040:AAEnvPS3qrgHKaYiuX1EE_U3NyEGdveFG64";

const CHAT_ID =
"700636974";

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

async function run(){

    try{

        // TURBO + PNIC
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

        await sendTelegram(

`🚀 LIVE PRICE

TURBO: $${turbo}

PNIC: $${pnic}`

        );

        console.log('Sent');

    }catch(e){

        console.log(e);

    }
}

run();
