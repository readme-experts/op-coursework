'use strict';

const promised = require('./promised.js');
const { Wallet } = require('./wallet.js');
const { writeFile } = require('./crypto.js');
const codesList = require('./codesList.json');


const genWalletFeature = async () => {
  console.log('\x1b[32m', `Choose which wallet do you want to make:
    1 - Bitcoin;
    2 - Ethereum;
    3 - Dogecoin;
    Type anything to exit.`);
  const selection = parseInt(await promised.question('Select action\n')) - 1;
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
  return wallet;
};

const btcAdrBalance = async () =>  {
  const wallet = new Wallet();
  console.log('Write the address you want to get balance of\n');
  const adrs = await promised.question('');

  const res = await wallet.getAdrsBalance(adrs);
  await writeFile(res);
  return;
};

const nbuExchange = async () =>  {
  const data = await safeSpawn('python', './src/parser.py');
  console.table(data);
};

const monoExchange = async () => {
  const data = await safeGet('https://api.monobank.ua/bank/currency');
  if (data.errorDescription) {
    console.log(data.errorDescription);
    return;
  }
  for (const curr of data) {
    curr.currencyCodeA = codesList[curr.currencyCodeA];
    curr.currencyCodeB = codesList[curr.currencyCodeB];
    const rawDate = new Date(curr.date * 1000);
    curr.date = `${rawDate.getDate()}` +
        `.${rawDate.getMonth() + 1}` +
        `.${rawDate.getFullYear()}`;
  }
  console.table(data);
};

const privatExchange = async () => {
  const cash = await safeGet('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
  const nonCash = await safeGet('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11');
  const rateTypes = [cash, nonCash];

  while (true) {
    const first = 'Do you want to get cash rate (1) or non-cash rate (2)?\n';
    const userChoice = (await promised.question(first) - 1);
    if (userChoice <= 1) console.table(rateTypes[userChoice]);

    const second = 'Would you like to get another rate? (y/n)\n';
    const option = await promised.question(second);
    if (option !== 'y') break;
  }
};


module.exports = {
  genWalletFeature,
  btcAdrBalance
};
