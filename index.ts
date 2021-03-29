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


async function currToCrypto(): Promise<object> {
  const currency: string = await question('Type currency you want to convert\n');
  const requestQuery: string = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=${currency}`;
  const result: object = await request(requestQuery);
  if (result) {
    const keys: string[] = Object.keys(result);
    for (const key of keys) {
      console.log(`${key}: ${result[key]}`);
    }
  }
  rl.close();
  return result;
}

async function topFiveCurrencies():Promise<object> {
  const requestQuery: string = `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD`;
  const currencies: any = (await request(requestQuery))['Data'];
  currencies.splice(4, 5);
  const result: string[] = currencies.map(item => item['CoinInfo']['FullName']);
  result.forEach((el: string, index: number) => {
    console.log(`${index + 1}. ${el}`);
  });
  rl.close();
  return result;
}


async function start(): Promise<void> {
  console.log(`Menu:
  1 - Currency to BTC exchange rate;
  2 - top five crypto by volume;
  Type anything to exit.`
  );
  const selection: number = parseInt(await question('Select action\n'));
  switch (selection) {
  case 1:
    await currToCrypto();
    break;
  case 2:
    await topFiveCurrencies();
    break;
  default: process.exit();
  }
}


start();


