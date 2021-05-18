'use strict';

const { Crypto, writeFile } = require('./src/crypto.js');
const { Wallet } = require('./src/wallet');
const { question } = require('./src/promised.js');

const crypto = new Crypto();

async function genWalletFeature() {
  console.log('\x1b[32m', `Choose which wallet do you want to make:
  1 - Bitcoin;
  2 - Ethereum;
  3 - Dogecoin;
  Type anything to exit.`);
  const selection = parseInt(await question('Select action\n')) - 1;
  const currencies = ['btc', 'eth', 'doge'];
  const resWall = currencies[selection];
  const wallet = new Wallet(resWall, 'd190d4bbbc9e47a1962739eeb93f1819');
  await wallet.createWallet();
  console.log(`Wallet was successfully created! Your wallet data:
  ${wallet.keys}
   Please don't send anyone your private key or wif
   or you'll loose your money.
   We don't save any information about created wallets
   Make sure you saved all the information.
   `);
  return 201;
}

async function btcAdrBalance() {
  const wallet = new Wallet();
  console.log('Write the address you want to get balance of\n');
  const adrs = await question('');

  const res = await wallet.getAdrsBalance(adrs);
  await writeFile(res);
  return;
}

async function menu() {
  console.log('\x1b[32m', `Menu:
  1 - Currency to BTC exchange rate
  2 - Top five crypto by volume
  3 - Currency 24 h volume
  4 - Exchange rates of UAH from bank.gov.ua
  5 - Create wallet on BlockCypher
  6 - BTC Address Balance
  8 - Recent Crypto News
  Type anything to exit.`);
  const selection = parseInt(await question('Select action\n')) - 1;
  let features = [
    crypto.currencyToCrypto,
    crypto.topFiveCurrencies,
    crypto.currencyPriceVolume,
    crypto.nbuExchange,
    crypto.cryptoNews,
    genWalletFeature,
    btcAdrBalance,
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
