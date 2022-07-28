import Binance from 'binance-api-node';
const client = Binance({
    apiKey: 'vcZ8xNHHgMvndJ6DTR23jq6VYSafFkP0qJvxvTIUDlTVrVAgLYOQBfj99p2pKNOZ',
    apiSecret: 'GHPSwDsVTHxdT3LVlJc03zVKwXQHQNAEA0blp44osTD9Y1i11S18DRCwYWIG4Jnn',
    useServerTime: true,
});

export default async function handler(req,res){
    let ticker = await client.prices();
    res.json(ticker);
}