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
  let body = JSON.parse(req.body);
  console.log(JSON.stringify(body));

  console.log("outside");
  let decimalCount = num => {
    let numStr = String(num);
    if (numStr.includes('.') || numStr != 1) {
      let str = numStr.split('.');
      let valstr;
      if (str[1] == undefined || str[0] == 1) {
        valstr = 0;
      } else {
        if (str[1] != undefined || str[1].includes('1')) {
          console.log("if");
          str = str[1].split('1');
          valstr = str[0];
          valstr = parseInt((valstr.length + 1));
          // valstr = parseInt((valstr.length));
        } else {
          console.log("else");
          valstr = 0;
        }
      }

      console.log("valstr" + valstr);

      return valstr;
    };
    return 0;
  }

  function splitData(num, val) {
    let numStr = String(num);
    if (numStr.includes('.')) {
      let str = numStr.split('.');
      let str1 = str[0];
      if (str[1] != '' || str[1] != undefined || str[1] != 0) {
        str = str[1].slice(0, val);
        if (str != '' || str != undefined || str != 0) {
          str = str1 + "." + str;
        } else {
          str = str1;
        }
      } else {
        str = str1;
      }
      if (val == 0) {
        str = str1;
      }


      // console.log("str "+str);
      return str;
    }
    return numStr;
  }




  async function order(symbol, side, quantity) {
    let response;
    console.log(symbol);
    console.log(quantity);
    if (side == "buy") {
      response = await client.marketBuy(symbol, quantity).catch(e => {
        console.log(JSON.stringify(e));
      });
    }
    else {
      response = await client.marketSell(symbol, quantity).catch(e => {
        console.log(JSON.stringify(e));
      });
    }
    return response;
  }

  async function getBalance(asset) {
    let bal = await client2.capitalConfigs();

    let balance;
    for (let i in bal) {
      if (bal[i].coin == asset) {
        balance = bal[i].free;
      }
    }
    return balance;
  }


  let symbol1 = body.symbol1;
  let symbol2 = body.symbol2;
  let symbol3 = body.symbol3;

  // let price2 = ticker[symbol2];
  // let price3 = ticker[symbol3];

  let quantity1 = body.quantity1;
  let quantity2 = body.quantity2;
  let quantity3 = body.quantity3;
  let asset2 = body.asset2;


  let firstTrade = await fetch('http://localhost:3000/api/binance');
  firstTrade = await firstTrade.json();
  firstTrade = firstTrade.symbols;

  
  for (let i in firstTrade) {
    let stepSize, stepSize2;

    let data = firstTrade[i];

    console.log(data.symbol[symbol2]);
    if (data.symbol == symbol2) {
      stepSize = data.filters[2].stepSize;
    }
    if (data.symbol == symbol3) {
      stepSize2 = data.filters[2].stepSize;
    }



    console.log("stepsize"+stepSize);

    console.log("workinggggggggggggggggg");
    if (symbol1 != undefined) {
      let ticker = await client.prices();
      let response_one = await client.marketBuy(symbol1, quantity1);
      console.log(response_one.status);
      let status = response_one.status;
      if (status == "FILLED" && data.symbol == symbol2) {
        console.log("filled");
        console.log("symbol1 " + response_one.symbol);
        console.log("quantity1 " + response_one.fills[0].qty);
        let per = 0.0001;
        if (asset2 == "BTC") {
          per = 0.0001;
        }

        let bal = await client2.capitalConfigs();
        let balance;
        for (let i in bal) {
          if (bal[i].coin == asset2) {
            balance = bal[i].free;
          }
        }
        console.log("balance2 " + balance);
        let quan = decimalCount(stepSize);
        let quant1 = 0;
        // console.log("res " + JSON.stringify(res.fills[0]));
        let fill = response_one.fills[0];
        // console.log("fill" + JSON.stringify(fill));
        console.log(fill.qty);
        console.log(fill.commission);
        // let q = parseFloat(fill.qty) - parseFloat(fill.commission);
        let q = parseFloat(fill.qty);
        quant1 += q;

        quant1 = Number(quant1);

        console.log("quant1 " + quantity1);

        console.log("price " + ticker[symbol2]);
        let secondTradeQty = quantity1 / ticker[symbol2];
        console.log("secondTradeqty " + secondTradeQty);

        quantity2 = splitData(secondTradeQty, quan);


        let fees = per * secondTradeQty;
        secondTradeQty = secondTradeQty - fees;

        quantity2 = splitData(secondTradeQty, quan);
        console.log("quan22222222222222222222222222222222222222222" + quantity2);

        setTimeout(async () => {


          let response_two = await client.marketBuy(symbol2, quantity2);
          console.log("response_two " + JSON.stringify(response_two));

          console.log(response_two.status);

          let status1 = response_two.status;
          if (status1 == "FILLED" && data.symbol == symbol3) {

            let fill1 = response_two.fills[0];
            // let q = parseFloat(fill1.qty) - parseFloat(fill1.commission);
            let q = parseFloat(fill1.qty);
            quantity3 = q;

            quantity3 = Number(quantity3);


            let quan1 = decimalCount(stepSize2);
            let fees = 0.00001 * quantity2;
            quantity3 = quantity3 - fees;
            quantity3 = splitData(quantity3, quan1);
            console.log("quantity3 " + quantity3);
            await client.marketSell(symbol3, quantity3).then(res => {
              console.log(JSON.stringify(res));
            }).catch(e => {
              console.log(e);
            });
          }
        }, 1000);

      }
    }
    // let response_one = await client.marketBuy(symbol1, quantity1).then(res => {
    //   // console.log("res1 " + JSON.stringify(res));
    //   // console.log(res.status);
    //   console.log("outside");
    //   let status = res.status;
    //   if (status == "FILLED") {
    //     console.log("filled");

    //     console.log("symbol1 " + res.symbol);
    //     console.log("quantity1 " + res.fills[0].qty);
    //     let per = 0.002;
    //     if (asset2 == "BTC") {
    //       per = 0.005;
    //     }

    //     getBalance(asset2).then(bal => {

    //       console.log("balance2 " + bal);

    //       console.log("symbol2 " + symbol2);

    //       let quan = decimalCount(stepSize);
    //       let quant1 = 0;
    //       // console.log("res " + JSON.stringify(res.fills[0]));
    //       let fill = res.fills[0];
    //       // console.log("fill" + JSON.stringify(fill));
    //       console.log(fill.qty);
    //       console.log(fill.commission);
    //       // let q = parseFloat(fill.qty) - parseFloat(fill.commission);
    //       let q = parseFloat(fill.qty);
    //       quant1 += q;

    //       quant1 = Number(quant1);

    //       console.log("quant1 " + quant1);

    //       console.log("price "+ticker[symbol2]);
    //       let secondTradeQty = quant1 / ticker[symbol2];
    //       console.log("secondTradeqty " + secondTradeQty);

    //       quantity2 = splitData(secondTradeQty, quan);

    //       let fees = per * secondTradeQty;
    //       secondTradeQty = secondTradeQty - fees;

    //       quantity2 = splitData(secondTradeQty, quan);
    //       console.log("quan22222222222222222222222222222222222222222" + quantity2);


    //       order(symbol2, "buy", quantity2).then(result => {
    //         console.log("res2 " + JSON.stringify(result));

    //         console.log(result.status);

    //         let status = result.status;
    //         if (status == "FILLED") {

    //           let fill = result.fills[0];
    //           // let q = parseFloat(fill.qty) - parseFloat(fill.commission);
    //           let q = parseFloat(fill.qty);
    //           quantity3 = q;

    //           quantity3 = Number(quantity3);

    //           let quan1 = decimalCount(stepSize2);
    //           quantity3 = splitData(quantity2, quan1);
    //           console.log("quantity3 " + quantity3);

    //           order(symbol3, "sell", quantity3).then(ress => {
    //             console.log(JSON.stringify(ress));
    //           }).catch(e => {
    //             console.log(e);
    //           });
    //         }

    //       }).catch(e => {
    //         console.log(e);
    //       });

    //     });
    //   }

    // }).catch(e => {
    //   console.log(JSON.stringify(e));
    // });

    // setTimeout(async()=>{

    //   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    //   let bal = await client2.capitalConfigs();

    //   let balance;
    //   for (let i in bal) {
    //     if (bal[i].coin == asset2) {
    //       balance = bal[i].free;
    //     }
    //   }
    //   console.log("balanceeeeeeeeeeeeeeeeeeeeeee "+balance);
    //   let quan = decimalCount(stepSize);

    //   let secondTradeQty = quantity1 / ticker[symbol2];
    //   console.log("secondTradeqty " + secondTradeQty);

    //   quantity2 = splitData(secondTradeQty, quan);

    //   let fees = 0.002 * secondTradeQty;
    //   secondTradeQty = secondTradeQty - fees;

    //   quantity2 = splitData(secondTradeQty, quan);
    //   console.log("quan22222222222222222222222222222222222222222" + quantity2);
    //   console.log("symbol222222222"+symbol2);

    //   await client.marketBuy(symbol2,quantity2).then(resss=>{
    //     console.log("ress2 "+JSON.stringify(resss));
    //   }).catch(e=>{
    //     console.log(JSON.stringify(e));
    //   });


    //   setTimeout(async()=>{

    //     console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");

    //     let bal = await client2.capitalConfigs();

    //     let balance;
    //     for (let i in bal) {
    //       if (bal[i].coin == asset2) {
    //         balance = bal[i].free;
    //       }
    //     }
    //     console.log("balanceeeeeeeeeeeeeeeeeeeeeeebbbbbbbbb "+balance);
    //     let quan = decimalCount(stepSize);

    //     let secondTradeQty = quantity1 / ticker[symbol2];
    //     console.log("secondTradeqty " + secondTradeQty);

    //     quantity2 = splitData(secondTradeQty, quan);

    //     let fees = 0.002 * secondTradeQty;
    //     secondTradeQty = secondTradeQty - fees;

    //     quantity2 = splitData(secondTradeQty, quan);
    //     console.log("quan22222222222222222222222222222222222222222bbbbbbbb" + quantity2);
    //     console.log("symbol222222222bbbbbbbb "+symbol2);

    //     await client.marketBuy(symbol2,quantity2).then(resss=>{
    //       console.log("ress2bbbbbbb "+JSON.stringify(resss));
    //     }).catch(e=>{
    //       console.log(JSON.stringify(e));
    //     });

    //   },10000);

    // },10000);



    // }, 15000);

    // });







    // console.log(response_one);
    //  if (!response_one.status) response_one.status = "";
    //  if (response_one.status == "FILLED") {

    // for (let i in response_one.fills) {
    //     let fill = response_one.fills[i];
    //     let q = parseFloat(fill.qty) - parseFloat(fill.commission);
    //     quantity2 += q;
    //   }

    // console.log("asset2" + asset2);

    // getBalance(asset2).then(res => {
    //   let bal = res;
    //   console.log(bal);

    // })
    //  let bal = await client2.capitalConfigs();

    //    let balance;
    //    for(let i in bal){
    //        if(bal[i].coin == asset2){
    //            balance = bal[i].free;
    //        }
    //    }

    //    console.log("balance"+balance);
    //    quantity1 = balance;
    //    console.log("ticker[symbol2]"+ticker[symbol2]);

    //    console.log("symbol2 "+symbol2);
    //    let quan = decimalCount(stepSize);
    //    let secondTradeQty = quantity1 / ticker[symbol2];
    //    console.log("secondTradeqty "+secondTradeQty);

    //    quantity2 = splitData(secondTradeQty,quan);

    //    let fees  = 0.001*secondTradeQty;
    //    secondTradeQty = secondTradeQty - fees;

    //    quantity2 = splitData(secondTradeQty,quan);
    //    console.log("quantity2 "+quantity2);




    //      let response_two = await client.marketBuy(symbol2, quantity2).catch(e=>{
    //        console.log(JSON.stringify(e));
    //       });

    //      // if (!response_two.status) response_two.status = "";
    //      // if (response_two.status == "FILLED" && response_two!=undefined) {
    //        for (let i in response_two.fills) {
    //            let fill = response_two.fills[i];
    //            let q = parseFloat(fill.qty) - parseFloat(fill.commission);
    //            quantity3 += q;
    //          }
    //          let fee = 0.0001*quantity3;
    //          quantity3 = quantity3-fee;
    //          let quan1 = decimalCount(stepSize2);
    //          quantity3 = splitData(quantity3,quan1);
    //          console.log("quantity3 "+quantity3);

    //          let response_three = await client.marketSell(symbol3, quantity3).catch(e=>{
    //            console.log(JSON.stringify(e));
    //           });

    //          console.log(response_three);


  }

  //  }


  // console.log("order1"+JSON.stringify(order1));

  //   await client.order({
  //     symbol: symbol2,
  //     side: 'BUY',
  //     quantity: quantity2,
  //     type:"MARKET"
  // });
  // // console.log("order2"+JSON.stringify(order2));


  //    await client.order({
  //     symbol: symbol3,
  //     side: 'SELL',
  //     quantity: quantity3,
  //     type:"MARKET"
  // });
  // console.log("order3"+JSON.stringify(order3));


  // }
  res.json("trade");
}