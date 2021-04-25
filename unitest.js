'use strict';
const { Crypto } = require('./src/crypto.js');
const { Wallet } = require('./src/wallet');
const { Promised } = require('./src/promised.js');
const assert = require('assert');

const crypto = new Crypto();

// testing "Currency 24h volume" feature

async function CurrVolumeRes(curr, volumeCurr) {
  const defaultUrl = 'https://min-api.cryptocompare.com/data';
  const url = `/v2/histoday?fsym=${curr}&tsym=${volumeCurr}&limit=1`;
  const query = defaultUrl + url;
  const temp = await crypto.getCurrencyPriceVolume(query, volumeCurr);
  return temp;
}

const testCurrVol = (async (cur1, cur2) => {
  const test1 = await CurrVolumeRes(cur1, cur2);
  console.log(test1);
  return test1;
});


//const temp = testCurrVol('BTC', 'USD');
console.log(testCurrVol('BTC', 'USD'));
//testCurrVol('BTC', 'USD')
//console.dir(testCurrVol('BTC', 'USD'));

/* async function testCurVolume() {
    await assert.match(testCurrVol('BTC', 'USD'), /lowest/);
}
*/










//
