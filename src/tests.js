'use strict';

const { Crypto } = require('./crypto.js');
const exchanges = require('./exchanges.js');
const assert = require('assert').strict;

const crypto = new Crypto();

(async () => {
  {
    const result = await crypto.currencyPriceVolume('USD, BTC');
    assert.match(result, /lowest/);
    console.log('\'USD, BTC\' passed');
  }
  {
    const call = await exchanges.transactionInfo(1, 0);
    assert.strictEqual(call, 'Wrong hash');
  }
  process.exit();
})();
