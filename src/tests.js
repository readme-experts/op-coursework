'use strict';

const { Crypto } = require('./crypto');
const assert = require('assert').strict;

const crypto = new Crypto();

(async () => {
  const result = await crypto.getCurrencyPriceVolume('USD, BTC');
  assert.match(result, /lowest/);
  console.log('Passed');
})();
