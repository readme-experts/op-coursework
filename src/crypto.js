'use strict';

const promised = require('./promised.js');

const errorHandlerWrapped = promised.errorWrapper(promised.handler);

const safeGet = errorHandlerWrapped(promised.getRequest);
//const safeWrite = errorHandlerWrapped(promised.writeFile);

class RawCrypto {
  //#apiKey;

  constructor(/*key*/) {
    this.defaultUrl = 'https://min-api.cryptocompare.com/data';
    //this.#apiKey = (key) ? key : null;
  }

  async currencyToCrypto(currency) {
    if (currency === undefined) {
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
      //await safeWrite(resultText);
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
    //await safeWrite(resultText);
    return resultText.join('\n');
  }

  async currencyPriceVolume(input) {
    if (input === undefined) {
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
      const lowestText = promised.colors.red + lowText + promised.colors.green;
      const highestText = `The highest price for 24 hours is: ${highest}`;
      diff = priceDiff > 0 ? '+' + diff : diff;
      const diffText = `24 hour price differance: ${diff}`;
      resultText.push(lowestText, highestText, diffText);

      console.log(`${resultText.join('\n')}\n`);
      //await safeWrite(resultText);
    }
    return resultText.join('\n');
  }

  async cryptoNews(writtenTitleNumber) {
    const info = await safeGet(`${this.defaultUrl}/v2/news/?lang=EN`);
    const data = info.Data;
    const articleNumbers = [1, 2, 3, 4, 5];

    const proposedTitles =
      '\nFive most recent articles on cryptocurrency:\n' +
      data
        .filter((item, index) => index < articleNumbers.length)
        .map(
          (item, index) => `${index + 1}. ${promised.decodeString(item.title)}`
        )
        .join('\n') + '\n';

    if (writtenTitleNumber === undefined) {
      console.log(proposedTitles);
      writtenTitleNumber = await promised.question(
        'Enter number of article\'s title you\'d like to read:\n'
      );
    }

    if (!articleNumbers.includes(+writtenTitleNumber)) {
      throw new Error('Error inside function: "Wrong number"');
    } else if (data[writtenTitleNumber - 1].body === '') {
      throw new Error('Error inside function: "API bug(body empty)"');
    }

    const fixedBody = promised.decodeString(
      data[writtenTitleNumber - 1].body
    );
    const result = `${writtenTitleNumber}. ` +
      `${promised.decodeString(data[writtenTitleNumber - 1].title)}` +
      `\n${fixedBody}`;
    console.log(`\n${result}\n`);
    return result;
  }

  static from(key) {
    return new RawCrypto(key);
  }
}

const Crypto = promised.classWrapper(RawCrypto, promised.classHandler);

module.exports = {
  Crypto,
};
