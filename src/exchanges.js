'use strict';

const promised = require('./promised.js');
const { Wallet } = require('./wallet.js');
const codesList = require('./codesList.json');

const errorHandlerWrapped = promised.errorWrapper(promised.handler);

const safeGet = errorHandlerWrapped(promised.getRequest);
const safePost = errorHandlerWrapped(promised.postRequest);
const safeSpawn = errorHandlerWrapped(promised.promiseSpawn);
//const safeWrite = errorHandlerWrapped(promised.writeFile);

const genWalletFeature = async selection => {
  if (selection === undefined) {
    console.log(
      '\x1b[32m',
      `Choose which wallet do you want to make:
      1 - Bitcoin;
      2 - Ethereum;
      3 - Dogecoin;
      Type anything to exit.`
    );
    selection = parseInt(await promised.question('Select action\n'));
  }
  const currencies = ['btc', 'eth', 'doge'];

  if (!currencies[selection - 1]) {
    throw new Error('Error inside function: "Wrong number"');
  }

  const resWall = currencies[selection - 1];
  const wallet = new Wallet(resWall, 'd190d4bbbc9e47a1962739eeb93f1819');
  await wallet.createWallet();
  console.log(`Wallet was successfully created! Your wallet data:
    ${wallet.keys}
     Please don't send anyone your private key or wif
     or you'll loose your money.
     We don't save any information about created wallets
     Make sure you saved all the information.
     `);
  console.log(wallet.keys.join('\n'));
  return wallet.keys.join('\n');
};

const btcAdrBalance = async (adrs) => {
  const wallet = new Wallet();
  if (adrs === undefined) {
    console.log('Write the address you want to get balance of\n');
    adrs = await promised.question('');
  }
  const res = await wallet.getAdrsBalance(adrs);
  //await safeWrite(res);
  return res.join('\n');
};

const nbuExchange = async () => {
  const data = await safeSpawn('python', './src/parser.py');
  console.table(data);
};

const nbuAlternative = async () => {
  const data = await safeGet(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  console.table(data);
};

const currencyCodeNumber = async () => {
  const question = 'Enter currency code or its number:\n';
  while (true) {
    const request = await promised.question(question);
    const error =
      `${promised.colors.red}` +
      'Something went wrong!\nMake sure you entered correct data.' +
      `${promised.colors.green}`;

    if (/^\d+$/.test(request)) {
      const code = codesList[parseInt(request)];
      if (!code) {
        console.log(error);
      } else {
        console.log(code);
      }
    } else if (/[a-zA-Z]/.test(request)) {
      let currency;
      for (const curr in codesList) {
        if (request.toUpperCase() === codesList[curr]) currency = curr;
      }
      currency ? console.log(currency) : console.log(error);
    } else {
      console.log(error);
    }

    const loop = 'Would you like to get another currency? (y/n)\n';
    const option = await promised.question(loop);
    if (option !== 'y') break;
  }
};

const monoExchange = async () => {
  const data = await safeGet('https://api.monobank.ua/bank/currency');
  if (data.errorDescription) {
    throw new Error(data.errorDescription);
  }
  for (const curr of data) {
    curr.currencyCodeA = codesList[curr.currencyCodeA];
    curr.currencyCodeB = codesList[curr.currencyCodeB];
    const rawDate = new Date(curr.date * 1000);
    curr.date =
      `${rawDate.getDate()}` +
      `.${rawDate.getMonth() + 1}` +
      `.${rawDate.getFullYear()}`;
  }
  console.table(data);
  return data[0].currencyCodeA;
};

const privatExchange = async () => {
  const cash = await safeGet(
    'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
  );
  const nonCash = await safeGet(
    'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11'
  );
  const rateTypes = [cash, nonCash];

  while (true) {
    const first = 'Do you want to get cash rate (1) or non-cash rate (2)?\n';
    const userChoice = (await promised.question(first)) - 1;
    if (userChoice <= 1) console.table(rateTypes[userChoice]);

    const second = 'Would you like to get another rate? (y/n)\n';
    const option = await promised.question(second);
    if (option !== 'y') break;
  }
};

const feesRate = async () => {
  const cryptos = ['bitcoin', 'bitcoin-cash', 'dogecoin', 'dash', 'litecoin'];
  const res = [];
  res.push('These are fee rates for some cryptocurrencies:');
  const options = {
    method: 'GET',
    hostname: 'rest.cryptoapis.io',
    path: '',
    qs: [],
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': '43a92a397d069a08d7699bf43463076a5209771d',
    },
  };
  for (const crypto of cryptos) {
    const path = `/v2/blockchain-data/${crypto}/testnet/mempool/fees`;
    options.path = path;
    res.push(crypto.toUpperCase());
    const result = await safePost(options, '');
    const keys = Object.keys(result.data.item);
    keys.shift();
    for (const key of keys) {
      res.push(`${key}: ${result.data.item[key]}`);
    }
    res.push('\n');
  }
  console.log(res.join('\n'));
  return res.join('\n');
};

const transactionInfo = async (chosenCrypto, hash) => {
  const cryptoNames = ['Bitcoin', 'Dash', 'Dogecoin', 'Litecoin'];
  const abbreviation = ['btc', 'dash', 'doge', 'ltc'];

  if (chosenCrypto === undefined) {
    console.log('\nList of cryptos:');
    for (const value of cryptoNames) {
      console.log(`${cryptoNames.indexOf(value) + 1}. ${value}`);
    }

    chosenCrypto = await promised.question(
      '\nEnter the number' +
      ' of crypto from the list above you\'d to like to input hash of:\n'
    );
  }

  if (!cryptoNames[chosenCrypto - 1]) {
    throw new Error('Error inside function: "Wrong number"');
  }

  if (hash === undefined) {
    hash = await promised.question(
      '\nEnter the hash of transaction you\'d like to get info about: \n'
    );
  }

  const hashDefaultLength = 64;
  if (hash.length !== hashDefaultLength) {
    throw new Error('Error inside function: "Wrong hash length"');
  }

  const info = await safeGet(
    `https://api.blockcypher.com/v1/${
      abbreviation[chosenCrypto - 1]
    }/main/txs/${hash}`
  );
  const keys = ['total', 'fees', 'size', 'preference', 'received'];
  const outputKeys = [
    '\nSatoshis sent',
    'Fee in satoshis',
    'Transaction size in bytes',
    'Transaction preference',
    'Received at',
  ];

  const result = [];
  if (Object.prototype.hasOwnProperty.call(info, 'error')) {
    throw new Error('Error inside function: "Wrong hash"');
  } else if (Object.prototype.hasOwnProperty.call(info, 'confirmed')) {
    keys.push('confirmed');
    outputKeys.push('Confirmed at');
  } else {
    result.push('\nTransaction isn\'t confirmed yet :C');
  }

  for (const value of outputKeys) {
    result.push(`${value}: ${info[keys[outputKeys.indexOf(value)]]}`);
  }
  console.log(result.join('\n') + '\n');
  return result.join('\n');
};

module.exports = {
  genWalletFeature,
  btcAdrBalance,
  nbuExchange,
  nbuAlternative,
  currencyCodeNumber,
  monoExchange,
  privatExchange,
  feesRate,
  transactionInfo,
};
