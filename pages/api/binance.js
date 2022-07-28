const fs = require('fs');

export default async function handler(req,res){

    let data = fs.readFileSync('binance.json');
    let result = JSON.parse(data);
    res.json(result);
}