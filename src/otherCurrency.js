'use strict';

const { question } = require('./promised.js');
const { Wallet } = require('./wallet.js');
const { writeFile } = require('./crypto.js');

const genWalletFeature = async () => {
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
  return wallet;
};

const btcAdrBalance = async () =>  {
  const wallet = new Wallet();
  console.log('Write the address you want to get balance of\n');
  const adrs = await question('');

  const res = await wallet.getAdrsBalance(adrs);
  await writeFile(res);
  return;
};

module.exports = {
  genWalletFeature,
  btcAdrBalance
};
