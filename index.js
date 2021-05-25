'use strict';

const { Crypto, writeFile } = require('./src/crypto.js');
const { Wallet } = require('./src/wallet');
const { question } = require('./src/promised.js');

const crypto = new Crypto();

async function menu() {
  console.log('\x1b[32m', `Menu:
  1 - Currency to BTC exchange rate
  2 - Top five crypto by volume
  3 - Currency 24 h volume
  4 - Exchange rates of UAH from bank.gov.ua
  5 - Create wallet on BlockCypher
  6 - BTC Address Balance
  7 - monobank exchange rates
  8 - Recent Crypto News
  9 - PrivatBank exchange rates
  Type anything to exit.`);
  const selection = parseInt(await question('Select action\n')) - 1;
  let features = [
    crypto.currencyToCrypto,
    crypto.topFiveCurrencies,
    crypto.currencyPriceVolume,
    crypto.nbuExchange,
    genWalletFeature,
    btcAdrBalance,
    crypto.monoExchange,
    crypto.cryptoNews,
    crypto.privatExchange,
  ];
  features = features.map(item => item.bind(crypto));
  if (features[selection]) await features[selection]();
  else process.exit();
}

(async () => {
  while (true) {
    await menu();
    const answ = await question('Clear menu(y/n)?\n');
    if (answ === 'y') console.clear();
  }
})();
