'use strict';
const https = require('https');
const readline = require('readline');
const fs = require('fs');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const green = '\x1b[32m';
const red = '\x1b[31m';


//Промисификация функций
const question = str => new Promise(resolve => rl.question(str, resolve));
const getRequest = async url => new Promise((resolve, reject) => {
  https.get(url, async res => {
    const buffers = [];
    for await (const chunk of res) buffers.push(chunk);
    const data = JSON.parse(Buffer.concat(buffers).toString());
    if (data.Response === 'Error') reject(data.Message);
    resolve(data);
  })
  //Чтобы отловить событие ошибки, потом нужно починить
    .on('error', reject);
});

const postRequest = (options, data) => new Promise((resolve, reject) => {
  const req = https.request(options, async res => {
    const buffers = [];
    for await (const chunk of res) buffers.push(chunk);
    const reqData = JSON.parse(Buffer.concat(buffers).toString());
    resolve(reqData);
  });
  req.write(data);
  req.on('error', reject);
  req.end();
});

const promiseSpawn = (lang, path) => new Promise((resolve, reject) => {
  const pyProcess = spawn(lang, [path]);
  pyProcess.stdout.on('data', data => resolve(JSON.parse(data)));
  pyProcess.stderr.on('data', err => reject(err));
});

//Запись ответа в файл
const writeFile = async resultTxt => {
  const selection = parseInt(await question('Print 1 to save results\n'));
  if (selection === 1) {
    const fileName = ('Write the name of txt file to save your results\n');
    const txtName = await question(fileName);
    fs.writeFileSync(`${txtName}.txt`, resultTxt.join('\n'), 'utf8');
    return txtName;

  } else {
    process.exit();
  }

};

//Враппер для обработки ошибок
const errorWrapper = handleError => func => (...args) =>
  func(...args).catch(handleError);

const handleError = e => {
  console.log(`Something gone wrong, error:\n${e}`);
  process.exit();
};

const errorHandlerWrapped = errorWrapper(handleError);

//Обернутая функция request
const safeGet = errorHandlerWrapped(getRequest);
const safeSpawn = errorHandlerWrapped(promiseSpawn);
const safePost = errorHandlerWrapped(postRequest);

class Crypto {
  constructor(key) {
    this.defaultUrl = 'https://min-api.cryptocompare.com/data';
    this._apiKey = (key) ? key : null;
  }

  async currencyToCrypto() {
    const currency = await question('Type currency you want to convert\n');
    const query = this.defaultUrl + `/price?fsym=BTC&tsyms=${currency}`;
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
    rl.close();
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
    rl.close();
    return result;
  }


  async currencyPriceVolume() {
    const currText = 'Type curr you want to get 24h volume of/res curr\n';
    const [curr, volumeCurr] = (await question(currText)).split(',');
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
    rl.close();
    return result.Data;
  }

  async nbuExchange() {
    const data = await safeSpawn('python', './src/parser.py');
    console.table(data);
  }

  static from(key) {
    return new Crypto(key);
  }

}

class Wallet {
  constructor(currency, token) {
    this.defaultUrl = 'api.blockcypher.com';
    this.defaultPath = `/v1/${currency}/main/`;
    this._token = token;
  }

  async createWallet() {
    const path = this.defaultPath + `addrs?token=`;
    const data = JSON.stringify({
      token: this._token,
    });
    const options = {
      method: 'POST',
      hostname: this.defaultUrl,
      path,
      headers: {},
    };
    const result = await safePost(options, data);
    this._keys = result;
    return result;
  }
  get key() {
    return this._keys.public;
  }
}

module.exports = {
  question,
  Crypto,
  Wallet,
  getRequest,
  writeFile,
  errorWrapper,
};
