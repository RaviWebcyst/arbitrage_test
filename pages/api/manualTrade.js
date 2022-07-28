const Binance = require("node-binance-api");
const client = new Binance().options({
    APIKEY: 'oPa8qb0rYxSvgdlLJI4fTUq3gCfdGoBmmcMGdb5O78AsMWFd9M9VcEkJXnKdQWup',
    APISECRET: 'JN3oqUiKkNyhqeUrJOgEBu9yN9dtipsTzajls6podfq594Qke20GTg1hHFFKoCtC',
    useServerTime: true,
});

import Binance2 from 'binance-api-node';
const client2 = Binance2({
    apiKey: 'oPa8qb0rYxSvgdlLJI4fTUq3gCfdGoBmmcMGdb5O78AsMWFd9M9VcEkJXnKdQWup',
    apiSecret: 'JN3oqUiKkNyhqeUrJOgEBu9yN9dtipsTzajls6podfq594Qke20GTg1hHFFKoCtC',
    useServerTime: true,
});

export default async function handler(req, res) {
    let bal = await client2.capitalConfigs();
    let balance =0;
    for(let i in bal){
        if(bal[i].free > 0 && bal[i].coin == "LIT"){
            balance= bal[i].free;
        }
    }
    console.log(balance);
    let response = await client.marketSell("BTCUSDT",0.00045).catch(e=>{
        console.log(JSON.stringify(e));
    });
    // let response = await client.marketBuy("MULTIBTC",9.980).then(res=>{
    //     console.log(JSON.stringify(res));
    // }).catch(e=>{
    //     console.log(JSON.stringify(e));
    // });

    res.json("working");
}