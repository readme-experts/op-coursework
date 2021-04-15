'use strict';

const { question, Crypto } = require('./api.js');

const api = new Crypto();


async function start() {
  console.log('\x1b[32m', `Menu:
  1 - Currency to BTC exchange rate;
  2 - top five crypto by volume;
  3 - Currency 24 h volume;
  4 - Exchange rates of UAH from bank.gov.ua
  Type anything to exit.`);
  const selection = parseInt(await question('Select action\n'));
  switch (selection) {
  case 1:
    await api.currencyToCrypto();
    break;
  case 2:
    await api.topFiveCurrencies();
    break;
  case 3:
    await api.currencyPriceVolume();
    break;
  case 4:
    await api.nbuExchange();
    break;
  default:
    process.exit();
  }
}


start();
