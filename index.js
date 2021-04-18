'use strict';

const { Crypto } = require('./src/crypto.js');
const { Wallet } = require('./src/wallet');
const { question } = require('./src/promised.js');

const crypto = new Crypto();
const wallet = new Wallet('btc', 'd190d4bbbc9e47a1962739eeb93f1819');

async function menu() {
  console.log('\x1b[32m', `Menu:
  1 - Currency to BTC exchange rate;
  2 - top five crypto by volume;
  3 - Currency 24 h volume;
  4 - Exchange rates of UAH from bank.gov.ua
  5 - Create wallet on BlockCypher
  Type anything to exit.`);
  const selection = parseInt(await question('Select action\n'));
  switch (selection) {
  case 1:
    await crypto.currencyToCrypto();
    break;
  case 2:
    await crypto.topFiveCurrencies();
    break;
  case 3:
    await crypto.currencyPriceVolume();
    break;
  case 4:
    await crypto.nbuExchange();
    break;
  case 5:
    await wallet.createWallet();
    console.log(`Wallet was successfully created! Your public key:
    ${wallet.key}`);
    break;
  default:
    process.exit();
  }
}
(async () => {
  while (true) {
    await menu();
    const answ = await question('Clear menu(y/n)?');
    if (answ === 'y') console.clear();
  }
})();

