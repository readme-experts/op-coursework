'use strict';

const { Wallet } = require('./src/wallet.js');
const { Crypto } = require('./src/crypto.js');
const { writeFile } = require('./src/crypto.js');
const { Wallet } = require('./src/wallet');
const { question } = require('./src/promised.js');

const crypto = new Crypto();

async function genWalletFeature() {
  console.log('\x1b[32m', `Choose which wallet do you want to make:
  1 - Bitcoin;
  2 - Ethereum;
  3 - Dogecoin;
  Type anything to exit.`);
  const selection = parseInt(await question('Select action\n'));
  let currency;
  switch (selection) {
  case 1:
    currency = 'btc';
    break;
  case 2:
    currency = 'eth';
    break;
  case 3:
    currency = 'doge';
    break;
  default:
    return;
  }
  const wallet = new Wallet(currency, 'd190d4bbbc9e47a1962739eeb93f1819');
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
  Type anything to exit.`);
  const selection = parseInt(await question('Select action\n'));
  switch (selection) {
  case 1: {
    const curr = await question('Type currency you want to convert\n');
    const result = await crypto.currencyToCrypto(curr);
    console.log(result);
    await writeFile(result);
    break;
  }
  case 2: {
    const result = await crypto.topFiveCurrencies();
    console.log(result);
    await writeFile(result);
    break;
  }
  case 3: {
    const query = 'Type curr you want to get 24h volume of/res curr\n';
    const input = await question(query);
    const result = await crypto.getCurrencyPriceVolume(input);
    console.log(result);
    await writeFile(result);
    break;
  }
  case 4:
    console.table(await crypto.nbuExchange());
    break;
  case 5:
    await genWalletFeature();
    break;
  case 6:
    await btcAdrBalance();
    break;
  default:
    process.exit();
  }
}

(async () => {
  while (true) {
    await menu();
    const answ = await question('Clear menu(y/n)?\n');
    if (answ === 'y') console.clear();
  }
})();
