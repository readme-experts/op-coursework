'use strict';

const fs = require('fs');
const https = require('https');
const promised = require('./promised.js');
const green = '\x1b[32m';
const red = '\x1b[31m';

const writeFile = async resultTxt => {
  const select = parseInt(await promised.question('Print 1 to save results\n'));
  if (select === 1) {
    const fileName = ('Write the name of txt file to save your results\n');
    const txtName = await promised.question(fileName);
    fs.writeFileSync(`${txtName}.txt`, resultTxt.join('\n'), 'utf8');
    return txtName;

  } else return;

};

const handleError = e => {
  console.log(`Something gone wrong, error:\n${e}`);
  process.exit();
};

const errorHandlerWrapped = promised.errorWrapper(handleError);

//Обернутая функция request
const safeGet = errorHandlerWrapped(promised.getRequest);
const safeSpawn = errorHandlerWrapped(promised.promiseSpawn);

class Crypto {
  constructor(key) {
    this.defaultUrl = 'https://min-api.cryptocompare.com/data';
    this._apiKey = (key) ? key : null;
  }

  async currencyToCrypto() {
    const curr = await promised.question('Type currency you want to convert\n');
    const query = this.defaultUrl + `/price?fsym=BTC&tsyms=${curr}`;
    const result = await safeGet(query);
    const resultText = [];
    if (result) {
      const keys = Object.keys(result);
      for (const key of keys) {
        resultText.push(`${key}: ${result[key]}`);
      }
      console.log(`${resultText.join('\n')}\n`);
      await writeFile(resultText);
    }
    return result;
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
    console.log(`${resultText.join('\n')}\n`);
    await writeFile(resultText);
    return result;
  }

  async currencyPriceVolume() {
    const currText = 'Type curr you want to get 24h volume of/res curr\n';
    const [curr, volumeCurr] = (await promised.question(currText)).split(',');
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
      const lowText = `The lowest price  for 24 hours is: ${lowest}`;
      const lowestText = red + lowText + green;
      const highestText = `The highest price for 24 hours is: ${highest}`;
      diff = (priceDiff > 0) ? '+' + diff : diff;
      const diffText = `24 hour price differance: ${diff}`;
      resultText.push(lowestText, highestText, diffText);
      console.log(`${resultText.join('\n')}\n`);
      await writeFile(resultText);
    }
    return result.Data;
  }

  async nbuExchange() {
    const data = await safeSpawn('python', './src/parser.py');
    console.table(data);
  }

  monoExchange() {
    https.get('https://api.monobank.ua/bank/currency', res => {
      if (res.statusCode !== 200) {
        const { statusCode, statusMessage } = res;
        console.log(`Status Code: ${statusCode} ${statusMessage}`);
        return;
      }

      let body = '';
      res.on('data', chunk => {
        body += chunk.toString();
      });

      res.on('end', () => {
        console.table(JSON.parse(body));
      });
    });
  }

  static from(key) {
    return new Crypto(key);
  }

}

module.exports = {
  Crypto,
  writeFile,
};
