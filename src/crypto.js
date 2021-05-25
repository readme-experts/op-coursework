'use strict';

const fs = require('fs');
const promised = require('./promised.js');
const codesList = require('./codesList.json');
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

  async monoExchange() {
    const data = await safeGet('https://api.monobank.ua/bank/currency');
    if (data.errorDescription) {
      console.log(data.errorDescription);
      return;
    }
    for (const curr of data) {
      curr.currencyCodeA = codesList[curr.currencyCodeA];
      curr.currencyCodeB = codesList[curr.currencyCodeB];
      const rawDate = new Date(curr.date * 1000);
      curr.date = `${rawDate.getDate()}` +
        `.${rawDate.getMonth() + 1}` +
        `.${rawDate.getFullYear()}`;
    }
    console.table(data);
  }

  async privatExchange() {
    const cash = await safeGet('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
    const nonCash = await safeGet('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11');
    const rateTypes = [cash, nonCash];

    while (true) {
      const first = 'Do you want to get cash rate (1) or non-cash rate (2)?\n';
      const userChoice = (await promised.question(first) - 1);
      if (userChoice <= 1) console.table(rateTypes[userChoice]);

      const second = 'Would you like to get another rate? (y/n)\n';
      const option = await promised.question(second);
      if (option !== 'y') break;
    }
  }

  async cryptoNews() {
    const info = await safeGet(`${this.defaultUrl} + 'v2/news/?lang=EN`);
    const data = info.Data;

    let proposedTitles = '\nFive most recent articles on cryptocurrency:\n';
    for (let i = 0; i < 5; i++) {
      const fixedTitle = promised.decodeString(data[i].title);
      proposedTitles += `${i + 1}. ${fixedTitle}\n`;
    }
    let bool = true;
    while (bool) {
      console.log(proposedTitles);
      const writtenTitleNumber = await promised.question(
        'Enter number of article\'s title you\'d like to read:\n');
      const fixedBody = promised.decodeString(data[writtenTitleNumber - 1].
        body);
      console.log('\n' + fixedBody);
      const option = await promised.question(
        '\nWould you like to read any other article from previous list?\ny/n?\n'
      );
      if (option !== 'y') bool = false;
    }
  }

  static from(key) {
    return new Crypto(key);
  }

}

module.exports = {
  Crypto,
  writeFile,
};
