'use strict';

const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (str: string): Promise<string> => new Promise(resolve => rl.question(str, resolve));
const request = (url: string): Promise<object> => new Promise((resolve, reject) => {
  const req = https.get(url, res => {
    const data: any = [];
    res.on('data', chunk => {
      data.push(chunk);
    });
    res.on('end', () => resolve(JSON.parse(data)));
  });
  req.on('error', reject);
  req.end();
});


async function currToCrypto(currency: string): Promise<object> {
  const requestQuery: string = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=${currency}`;
  const result: object = await request(requestQuery);
  return result;
}


async function start(): Promise<void> {
  const currency = await question('Type currency you want to convert\n');
  const query = await currToCrypto(currency);
  if (query) {
    const keys: string[] = Object.keys(query);
    for (const key of keys) {
      console.log(`${key}: ${query[key]}`);
    }
  }
  rl.close();
}


start();


