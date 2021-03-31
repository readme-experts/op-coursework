'use strict';

const readline = require('readline');
const https = require('https');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = str => new Promise(resolve => rl.question(str, resolve));
const request = async url => new Promise((resolve, reject) => {
    const req = https.get(url, res => {
        const data = [];
        res.on('data', chunk => {
            data.push(chunk);
        });
        res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
});


async function currToCrypto() {
    const currency = await question('Type currency you want to convert\n');
    const requestQuery = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=${currency}`;
    const result = await request(requestQuery);
    if (result) {
        const keys = Object.keys(result);
        for (const key of keys) {
            console.log(`${key}: ${result[key]}`);
        }
    }
    rl.close();
    return result;
}

async function topFiveCurrencies() {
    const requestQuery = `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD`;
    const currencies = (await request(requestQuery)).Data;
    currencies.splice(4, 5);
    const result = currencies.map(item => item.CoinInfo.FullName);
    result.forEach((el, index) => {
        console.log(`${index + 1}. ${el}`);
    });
    rl.close();
    return result;
}


async function currencyPriceVolume() {
    const currencyText = 'Type currency you want to get 24h volume of\n';
    const volCurrText = 'Type currency you want to get 24h volume result in\n';

    const currency = await question(currencyText);
    const volumeCurrency = await question(volCurrText);
    const requestQuery = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${currency}&tsym=${volumeCurrency}&limit=1`;
    const result = await request(requestQuery);
    let priceDifferance = result.Data.Data[1].close - result.Data.Data[0].close;
    priceDifferance = priceDifferance.toFixed(2);
    const lowest = `${result.Data.Data[1].low} ${volumeCurrency}`;
    const highest = `${result.Data.Data[1].high} ${volumeCurrency} `;
    const differace = `${priceDifferance} ${volumeCurrency}`;
    if (result) {
        console.log(`The lowest price  for 24 hours is: ${lowest}`);
        console.log(`The highest price for 24 hours is: ${highest}`);
        if (priceDifferance > 0) {
            console.log(`24 hour price differance: +${differace}`);
        } else {
            console.log(`24 hour price differance: ${differace}`);
        }

    }
    rl.close();
    return result;
}


async function start() {
    console.log(`
    Menu:
        1 - Currency to BTC exchange rate;
    2 - top five crypto by volume;
    3 - Currency 24 h volume
    Type anything to exit.
    `);
    const selection = parseInt(await question('Select action\n'));
    switch (selection) {
        case 1:
            await currToCrypto();
            break;
        case 2:
            await topFiveCurrencies();
            break;
        case 3:
            await currencyPriceVolume();
            break;
        default:
            process.exit();
    }
}


start();
