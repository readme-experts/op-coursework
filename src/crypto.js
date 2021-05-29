'use strict';

const promised = require('./promised.js');
const green = '\x1b[32m';
const red = '\x1b[31m';

const errorHandlerWrapped = promised.errorWrapper(promised.handler);

const safeGet = errorHandlerWrapped(promised.getRequest);
const safeWrite = errorHandlerWrapped(promised.writeFile);

class RawCrypto {
  //#apiKey;

  constructor(/*key*/) {
    this.defaultUrl = 'https://min-api.cryptocompare.com/data';
    //this.#apiKey = (key) ? key : null;
  }

  async currencyToCrypto(currency) {
    if (!currency) {
      currency = await promised.question('Type currency you want to convert\n');
    }
    const query = this.defaultUrl + `/price?fsym=BTC&tsyms=${currency}`;
    const result = await safeGet(query);
    const resultText = [];
    if (result) {
      const keys = Object.keys(result);
      for (const key of keys) {
        resultText.push(`${key}: ${result[key]}`);
      }
      console.log(`${resultText.join('\n')}\n`);
      await safeWrite(resultText);
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
    console.log(`${resultText.join('\n')}\n`);
    await safeWrite(resultText);
    return result;
  }

  async currencyPriceVolume(input) {
    if (!input) {
      const text = 'Type curr you want to get 24h volume of/res curr\n';
      input = await promised.question(text);
    }
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
      diff = priceDiff > 0 ? '+' + diff : diff;
      const diffText = `24 hour price differance: ${diff}`;
      resultText.push(lowestText, highestText, diffText);

      console.log(`${resultText.join('\n')}\n`);
      await safeWrite(resultText);
    }
    return resultText.join('\n');
  }

  async cryptoNews() {
    const info = await safeGet(`${this.defaultUrl}/v2/news/?lang=EN`);
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
        'Enter number of article\'s title you\'d like to read:\n'
      );
      const fixedBody = promised.decodeString(
        data[writtenTitleNumber - 1].body
      );
      console.log('\n' + fixedBody);
      const option = await promised.question(
        '\nWould you like to read any other article from previous list?\ny/n?\n'
      );
      if (option !== 'y') bool = false;
    }
  }

  async transactionInfo() {
    const cryptoNames = {
      1: 'Bitcoin',
      2: 'Dash',
      3: 'Dogecoin',
      4: 'Litecoin',
    };
    const abbreviation = {
      1: 'btc',
      2: 'dash',
      3: 'doge',
      4: 'ltc',
    };

    console.log('\nList of cryptos:');
    for (const key in cryptoNames) {
      console.log(`${key}. ${cryptoNames[key]}`);
    }

    const chosenCrypto = await promised.question('\nEnter the number' +
      ' of crypto from the list above you\'d to like to input hash of: \n');
    const hash = await promised.question('\nEnter the hash of ' +
      'transaction you\'d like to get info about: \n');

    if (hash.length !== 64) {
      console.log(`${red}Wrong hash${green}`);
      return;
    }

    const info = await safeGet(`https://api.blockcypher.com/v1/${abbreviation[chosenCrypto]}/main/txs/${hash}`);
    const keys = [
      'total',
      'fees',
      'size',
      'preference',
      'received',
    ];
    const outputKeys = [
      '\nSatoshis sent',
      'Fee in satoshis',
      'Transaction size in bytes',
      'Transaction preference',
      'Received at',
    ];
    if (Object.prototype.hasOwnProperty.call(info, 'error')) {
      console.log(`${red}Wrong hash${green}`);
      return;
    } else if (Object.prototype.hasOwnProperty.call(info, 'confirmed')) {
      keys.push('confirmed');
      outputKeys.push('Confirmed at');
    } else console.log('\nTransaction isn\'t confirmed yet :C');

    for (let i = 0; i < keys.length; i++) {
      console.log(`${outputKeys[i]}: ${info[keys[i]]}`);
    }
    console.log();
  }

  static from(key) {
    return new RawCrypto(key);
  }
}

const Crypto = promised.classWrapper(RawCrypto, promised.classHandler);

module.exports = {
  Crypto,
};
