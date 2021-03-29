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


async function currToCrypto(currency) {
  const requestQuery = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=${currency}`;
  const result = await request(requestQuery);
  return result;
}


async function start() {
  const currency = await question('Type currency you want to convert\n');
  const isValid = /[a-z]/ig.test(currency);
  if (!isValid) {
    console.log('Currency must be specified in Latin');
  } else {
    const query = await currToCrypto(currency);
    if (query) {
      const keys = Object.keys(query);
      for (const key of keys) {
        console.log(`${key}: ${query[key]}`);
      }
    }
  }
  rl.close();
}


start();


