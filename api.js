'use strict';
const https = require('https');
const readline = require('readline');

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

class Crypto {
  constructor(key) {
    this.defaultUrl = 'https://min-api.cryptocompare.com/data';
    this._apiKey = (key) ? key : null;
  }

  async currencyToCrypto() {
    const currency = await question('Type currency you want to convert\n');
    const query = this.defaultUrl + `/price?fsym=BTC&tsyms=${currency}`;
    const result = await request(query);
    if (result) {
      const keys = Object.keys(result);
      for (const key of keys) {
        console.log(`${key}: ${result[key]}`);
      }
    }
    rl.close();
    return result;
  }

  async topFiveCurrencies() {
    const query = this.defaultUrl + '/top/totalvolfull?limit=10&tsym=USD';
    const currencies = (await request(query)).Data;
    currencies.splice(4, 5);
    const result = currencies.map(item => item.CoinInfo.FullName);
    result.forEach((el, index) => {
      console.log(`${index + 1}. ${el}`);
    });
    rl.close();
    return result;
  }


  async currencyPriceVolume() {
    const currencyText = 'Type curr you want to get 24h volume of/res curr\n';
    const [curr, volumeCurr] = (await question(currencyText)).split(',');
    const url = `/v2/histoday?fsym=${curr}&tsym=${volumeCurr}&limit=1`;
    const query = this.defaultUrl + url;
    const result = await request(query);
    const data = result.Data;
    let priceDiff = data.Data[1].close - data.Data[0].close;
    priceDiff = priceDiff.toFixed(2);
    const lowest = `${data.Data[1].low} ${volumeCurr}`;
    const highest = `${data.Data[1].high} ${volumeCurr} `;
    let diff = `${priceDiff} ${volumeCurr}`;
    if (result) {
      console.log(`The lowest price  for 24 hours is: ${lowest}`);
      console.log(`The highest price for 24 hours is: ${highest}`);
      diff = (priceDiff > 0) ? '+' + diff : diff;
      console.log(`24 hour price differance: ${diff}`);
    }
    rl.close();
    return result.Data;
  }

  static from(key) {
    return new Crypto(key);
  }

}

module.exports = { question, Crypto, request };
