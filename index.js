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
  return result;
}



async function start() {
  console.log('Menu:\n1 - Currency to BTC exchange rate\nType anything to exit');
  const selection = parseInt(await question('Select action\n'));
  switch (selection) {
  case 1: {
    await currToCrypto();
    rl.close();
    break;
  }
  default: rl.close();
  }
}


start();


