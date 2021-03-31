'use strict';

const { question, Crypto } = require('./api.js');

const api = new Crypto();


async function start() {
  console.log(`Menu:
  1 - Currency to BTC exchange rate;
  2 - top five crypto by volume;
  Type anything to exit.`
  );
  const selection = parseInt(await question('Select action\n'));
  switch (selection) {
  case 1:
    await api.currencyToCrypto();
    break;
  case 2:
    await api.topFiveCurrencies();
    break;
  default: process.exit();
  }
}


start();


