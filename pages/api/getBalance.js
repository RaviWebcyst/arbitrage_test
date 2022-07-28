import Binance from 'binance-api-node';
const client = Binance({
    apiKey: 'oPa8qb0rYxSvgdlLJI4fTUq3gCfdGoBmmcMGdb5O78AsMWFd9M9VcEkJXnKdQWup',
    apiSecret: 'JN3oqUiKkNyhqeUrJOgEBu9yN9dtipsTzajls6podfq594Qke20GTg1hHFFKoCtC',
    useServerTime: true,
});

export default async function handler(req,res){
    let bal = await client.capitalConfigs();
    let balance = [];
    for(let i in bal){
        if(bal[i].free > 0){
            balance.push(bal[i]);
        }
    }
    res.json(balance);
}