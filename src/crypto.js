'use strict';

const promised = require('./promised.js');
const green = '\x1b[32m';
const red = '\x1b[31m';

const handleError = e => {
  console.log(`Something gone wrong, error:\n${e}`);
  process.exit();
};

const errorHandlerWrapped = promised.errorWrapper(handleError);

//Обернутая функция request
const safeGet = errorHandlerWrapped(promised.getRequest);
const safeSpawn = errorHandlerWrapped(promised.promiseSpawn);

class Crypto {

  //#apiKey;

  constructor(/*key*/) {
    this.defaultUrl = 'https://min-api.cryptocompare.com/data';
    //this.#apiKey = (key) ? key : null;
  }

  async currencyToCrypto(currency) {
    const query = this.defaultUrl + `/price?fsym=BTC&tsyms=${currency}`;
    const result = await safeGet(query);
    const resultText = [];
    if (result) {
      const keys = Object.keys(result);
      for (const key of keys) {
        resultText.push(`${key}: ${result[key]}`);
      }
    }
    return resultText.join('\n');
  }

  async topFiveCurrencies() {
    const query = this.defaultUrl + '/top/totalvolfull?limit=10&tsym=USD';
    const currencies = (await safeGet(query)).Data;
    currencies.splice(4, 5);
    const resultText = [];
    const result = currencies.map(item => item.CoinInfo.FullName);
    result.forEach((el, index) => {
      resultText.push(`${index + 1}. ${el}`);
    });
    return resultText.join('\n');
  }

  async getCurrencyPriceVolume(input) {
    const [curr, volumeCurr] = input.split(', ');
    const url = `/v2/histoday?fsym=${curr}&tsym=${volumeCurr}&limit=1`;
    const query = this.defaultUrl + url;
    const result = await safeGet(query);
    const data = result.Data;
    const resultText = [];
    let priceDiff = data.Data[1].close - data.Data[0].close;
    priceDiff = priceDiff.toFixed(2);
    const lowest = `${data.Data[1].low} ${volumeCurr}`;
    const highest = `${data.Data[1].high} ${volumeCurr} `;
    let diff = `${priceDiff} ${volumeCurr}`;
    if (result) {
      const lowText = `The lowest price for 24 hours is: ${lowest}`;
      const lowestText = red + lowText + green;
      const highestText = `The highest price for 24 hours is: ${highest}`;
      diff = (priceDiff > 0) ? '+' + diff : diff;
      const diffText = `24 hour price differance: ${diff}`;
      resultText.push(lowestText, highestText, diffText);
    }
    return resultText.join('\n');
  }


  async nbuExchange() {
    const data = await safeSpawn('python', './src/parser.py');
    return data;
  }

  static from(key) {
    return new Crypto(key);
  }

}

module.exports = {
  Crypto,
};
