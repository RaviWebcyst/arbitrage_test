const Binance = require("node-binance-api");
const client = new Binance().options({
  APIKEY: 'oPa8qb0rYxSvgdlLJI4fTUq3gCfdGoBmmcMGdb5O78AsMWFd9M9VcEkJXnKdQWup',
  APISECRET: 'JN3oqUiKkNyhqeUrJOgEBu9yN9dtipsTzajls6podfq594Qke20GTg1hHFFKoCtC',
  useServerTime: true,
});

export default async function handler(req,res){
    var body = JSON.parse(req.body);
    var symbol = body.symbol;
    var quantity = body.quantity;

    await client.marketBuy(symbol,quantity).then(resp=>{
        console.log("ressssssppppppppppppp"+JSON.stringify(resp));
        res.json(resp);
    }).catch(e=>{
        console.log("respe"+JSON.stringify(e));
        res.json(e);
    });
}