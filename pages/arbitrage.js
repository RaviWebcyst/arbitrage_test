
import { useEffect, useState } from "react";

export default function Arbitrage() {

    let [getData, setData] = useState();

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

    let decimalCount = num => {
        let numStr = String(num);
        if (numStr.includes('.') || numStr != 1) {
            let str = numStr.split('.');
            let valstr;
            if (str[1] == undefined || str[0] == 1) {
                valstr = 0;
            } else {
                if (str[1] != undefined || str[1].includes('1')) {
                    // console.log("if");
                    str = str[1].split('1');
                    valstr = str[0];
                    // console.log("valstrlength" + valstr.length);
                    // valstr = parseInt((valstr.length + 1));
                    valstr = parseInt((valstr.length));
                } else {
                    // console.log("else");
                    valstr = 0;
                }
            }

            // console.log("valstr" + valstr);

            return valstr;
        };
        return 0;
    }

    async function firstPairs() {
        let firstTrade = await fetch('api/binance');
        firstTrade = await firstTrade.json();
        firstTrade = firstTrade.symbols;

        let start_quantity = 1000;
        let first;
        let second;
        let arr = [];
        for (let i in firstTrade) {
            let symbols = firstTrade[i];
            if (symbols.symbol != "BTCUSDT") {
                continue;
            }
            // if (symbols.status == "BREAK") continue;
            // if (symbols.quoteAsset != "USDT" ) {
            //     continue;
            // }


            let symbol = symbols.symbol;
            let stepsize = symbols.filters[2].stepSize;
            let quan = decimalCount(stepsize);
            let coin = symbols.baseAsset;

            let ticker = await fetch("api/binance_prices");
            ticker = await ticker.json();
            let ticker1 = ticker[symbol];
            let first_quantity = start_quantity / ticker1;
            first_quantity = splitData(first_quantity, quan);
            for (let k in firstTrade) {
                let symbols2 = firstTrade[k];
                // if (symbols2.status == "BREAK") continue;
                if (symbols2.symbol != "ETHBTC") {
                    continue;
                }
                let symbol2 = symbols2.symbol;
                first = symbol2;
                let stepsize = symbols2.filters[2].stepSize;
                let quan = decimalCount(stepsize);
                let coin2 = symbols2.baseAsset;
                let ticker2 = ticker[symbol2];

                let second_quantity = first_quantity / ticker2;

                second_quantity = splitData(second_quantity, quan);


                for (let l in firstTrade) {
                    let symbols3 = firstTrade[l];

                    if (symbols3.symbol != "ETHUSDT") {
                        continue;
                    }

                    let symbol3 = symbols3.symbol;
                    // console.log(symbol3);
                    second = symbol3;
                    let ticker3 = ticker[symbol3];
                    let usdt = ticker3 * second_quantity;
                    arr['first'] = first;
                    arr['second'] = second;
                    arr['usdt'] = usdt;
                }

            }
        }
        console.log(arr);
    }

    useEffect(() => {
        (async () => {
            getPair();
        })();
        setTimeout(() => {
            getPair();
        }, 1000);
    })

    async function getPair() {
        // let firstTrade = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        let firstTrade = await fetch('api/binance');
        firstTrade = await firstTrade.json();
        firstTrade = firstTrade.symbols;
        let final_quantity = [];
        let arr = [];
        let j = 0;
        let sym1;
        let sym2;
        let sym3;
        let quan1;
        let quan2;
        let quan3;
        let asset2;
        for (let i in firstTrade) {
            let symbols = firstTrade[i];

            if (symbols.status == "BREAK") {
                continue;
            }

            if (symbols.quoteAsset != "USDT") {
                continue;
            }


            let symbol = symbols.symbol;
            // if (symbol == "BTCUSDT") {
            //     continue;
            // }

            let stepsize = symbols.filters[2].stepSize;
            let quan = decimalCount(stepsize);
            let coin = symbols.baseAsset;

            let ticker = await fetch("api/binance_prices");
            ticker = await ticker.json();
            let ticker1 = ticker[symbol];
            if (ticker1 != undefined) {
                let usdt_quantity = 50 / ticker1;
                usdt_quantity = splitData(usdt_quantity, quan);



                for (let k in firstTrade) {
                    let symbols2 = firstTrade[k];
                    if (symbols2.status == "BREAK") {
                        continue;
                    }
                    if (symbols2.quoteAsset != coin) {
                        continue;
                    }


                    final_quantity[j] = [];

                    let symbol2 = symbols2.symbol;
                    // console.log(symbol2);
                    let stepsize = symbols2.filters[2].stepSize;
                    let quan = decimalCount(stepsize);
                    let coin2 = symbols2.baseAsset;
                    let ticker2 = ticker[symbol2];
                    if (ticker2 != undefined) {

                        let second_quantity = usdt_quantity / ticker2;

                        second_quantity = splitData(second_quantity, quan);

                        let symbol3 = coin2 + "USDT";
                        let ticker3 = ticker[symbol3];
                        let usdt = ticker3 * second_quantity;
                        usdt = splitData(usdt, quan);
                        // console.log(usdt);
                        if (usdt > 50) {
                            //store profitable trade in mongodb
                            await fetch('api/add_trade', {
                                method: "POST",
                                body: JSON.stringify({
                                    symbol1: symbol,
                                    symbol2: symbol2,
                                    symbol3: symbol3,
                                    quantity1: usdt_quantity,
                                    quantity2: second_quantity,
                                    quantity3: usdt
                                })
                            })

                            final_quantity[j]['symbol1'] = symbol;
                            final_quantity[j]['symbol2'] = symbol2;
                            final_quantity[j]['symbol3'] = symbol3;
                            final_quantity[j]['quantity1'] = usdt_quantity;
                            final_quantity[j]['quantity2'] = second_quantity;
                            final_quantity[j]['end_usdt'] = usdt;

                            sym1 = symbol;
                            sym2 = symbol2;
                            sym3 = symbol3;
                            quan1 = usdt_quantity;
                            quan2 = second_quantity;
                            quan3 = usdt;
                            asset2 = coin;



                            // await fetch("api/arbitrageTrade",{
                            //     method:"POST",
                            //     body:JSON.stringify({
                            //         symbol1:symbol,
                            //         symbol2:symbol2,
                            //         symbol3:symbol3,
                            //         quantity1:usdt_quantity,
                            //         quantity2:second_quantity,
                            //         quantity3:usdt
                            //     })
                            // })

                            arr.push(<tr key={symbol2}>
                                <td>{symbol}</td>
                                <td>{symbol2}</td>
                                <td>{symbol3}</td>
                                <td>{usdt}</td>
                            </tr>);
                            j++;
                        }

                        // console.log(coin2);
                        // for (let l in firstTrade) {
                        //     let symbolsl = firstTrade[l];
                        //     let symbol3 = symbolsl.symbol;

                        //     final_quantity[j] = [];

                        //     if (symbol3 != coin2 + "USDT") {
                        //         continue;
                        //     }
                        //     console.log(symbol3);
                        //     let ticker3 = ticker[symbol3];

                        //     if (ticker3 != undefined) {

                        //         let usdt = ticker3 * second_quantity;
                        //         console.log(usdt);
                        //         if (usdt > 1000 && usdt != "" && usdt != undefined) {
                        //             // final_quantity.push(usdt);
                        //             final_quantity[j]['symbol1'] = symbol;
                        //             final_quantity[j]['symbol2'] = symbol2;
                        //             final_quantity[j]['symbol3'] = symbol3;
                        //             final_quantity[j]['quantity1'] = usdt_quantity;
                        //             final_quantity[j]['quantity2'] = second_quantity;
                        //             final_quantity[j]['quantity3'] = usdt;
                        //             j++;
                        //         }
                        //     }

                        // }
                    }
                }
            }
        }

        // await fetch("api/arbitrageTrade", {
        //     method: "POST",
        //     body: JSON.stringify({
        //         symbol1: sym1,
        //         symbol2: sym2,
        //         symbol3: sym3,
        //         quantity1: quan1,
        //         quantity2: quan2,
        //         quantity3: quan3,
        //         asset2: asset2
        //     })
        // })

        setData(arr);
        console.log(final_quantity);


    }

    async function getFirstPair() {

        let firstTrade = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        firstTrade = await firstTrade.json();
        firstTrade = firstTrade.symbols;
        var firstPair = [];
        let j = 0;
        for (let i = 0; i <= 50; i++) {
            let symbols = firstTrade[i];
            firstPair[j] = [];


            let symbol = symbols.symbol;


            // let lastChar = symbol.substr(symbol.length - 4);
            if (symbols.quoteAsset != "USDT") {
                continue;
            }
            let stepsize = symbols.filters[2].stepSize;
            let quan = decimalCount(stepsize);
            let coin = symbols.baseAsset;

            let ticker = await fetch("api/binance_prices");
            ticker = await ticker.json();
            ticker = ticker[symbol];
            console.log(ticker);
            if (ticker != undefined) {
                let usdt_quantity = 1000 / ticker;
                firstPair[j]['symbol'] = symbol;
                firstPair[j]['quantity'] = splitData(usdt_quantity, quan);
                firstPair[j]['price'] = ticker;
                firstPair[j]['coin'] = coin;
                j++;
            }

        }
        console.log(firstPair);


        let secondPair = [];
        let k = 0;
        for (let i = 0; i <= 50; i++) {
            let symbols = firstTrade[i];
            secondPair[k] = [];
            if (symbols.quoteAsset != firstPair[0]['coin']) {
                continue;
            }
            let symbol = symbols.symbol;



            let stepsize = symbols.filters[2].stepSize;
            let quan = decimalCount(stepsize);
            let coin = symbols.baseAsset;

            let ticker = await fetch("api/binance_prices");
            ticker = await ticker.json();
            ticker = ticker[symbol];
            if (ticker != undefined) {
                let usdt_quantity = ticker / firstPair[0]['quantity'];
                secondPair[k]['symbol'] = symbol;
                secondPair[k]['quantity'] = splitData(usdt_quantity, quan);
                secondPair[k]['price'] = ticker;
                secondPair[k]['coin'] = coin;
                k++;
            }

        }
        console.log(secondPair);

        let thirdPair = [];
        let m = 0;
        for (let i in firstTrade) {
            let symbols = firstTrade[i];
            thirdPair[m] = [];
            let symbol = symbols.symbol;
            if (symbol != secondPair[0]['coin'] + "USDT") {
                continue;
            }
            console.log(symbol);


            let stepsize = symbols.filters[2].stepSize;
            let quan = decimalCount(stepsize);
            let coin = symbols.baseAsset;

            let ticker = await fetch("api/binance_prices");
            ticker = await ticker.json();
            ticker = ticker[symbol];
            if (ticker != undefined) {
                let usdt_quantity = ticker / secondPair[0]['quantity'];
                let usdt = ticker * secondPair[j]['quantity'];
                thirdPair[m]['symbol'] = symbol;
                thirdPair[m]['quantity'] = splitData(usdt_quantity, quan);
                thirdPair[m]['coin'] = coin;
                thirdPair[m]['usdt'] = usdt;
                m++;
            }
        }


        console.log(thirdPair);



    }

    return (<div className="container">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
        {/* <button type="button" onClick={getPair}>First Pairs</button> */}
        <h1 className="text-center mt-3 mb-2"> Arbitrage Binance LeaderBoard</h1>
        <div className="mt-5 table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Symbol1</th>
                        <th>Symbol2</th>
                        <th>Symbol3</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {getData}
                </tbody>
            </table>
        </div>
    </div>);
}
