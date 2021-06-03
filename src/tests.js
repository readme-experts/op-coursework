'use strict';

const { Crypto } = require('./crypto.js');
const exchanges = require('./exchanges.js');
const assert = require('assert').strict;

const crypto = new Crypto();

(async () => {
  // 3
  {
    const result = await crypto.currencyPriceVolume('USD, BTC');
    assert.match(result, /lowest/);
    console.log('\'USD, BTC\' passed');
  }
  // 8
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n8. Tests for cryptoNews'
    );
    const expected = /[^1-5.\sa-z]/;
    //1-5 & 9 work, others - predictable errors
    const tests = [
      [2,          expected, 'Choice 2 failed'       ],
      [1,          expected, 'Choice 1 failed'       ],
      [3,          expected, 'Choice 3 failed'       ],
      [4,          expected, 'Choice 4 failed'       ],
      [5,          expected, 'Choice 5 failed'       ],
      [0,          expected, 'Wrong number: 0'       ],
      [1.5,        expected, 'Wrong number: 1.5'     ],
      [-6,         expected, 'Wrong number: -6'      ],
      ['2',        expected, '2 in string'           ],
      [null,       expected, 'null'                  ],
      [Number.NaN, expected, 'Number.Nan'            ],
      [2,          /Hello/,  'Actual(2) !== Expected'],
    ];

    const results = [];
    for (const test of tests) {
      const [number, expected, name] = test;
      let result;
      try {
        result = await crypto.cryptoNews(number);
        assert.match(result, expected, `Error in test "${name}"`);
      } catch (err) {
        const { message } = err;
        let { operator } = err;
        if (!operator) operator = 'insideFunction';
        results.push({ message, number, operator });
      }
    }
    console.table(results);
  }
  // 10
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n10. Test for feesRate'
    );
    const expected = /fast:\s\d/;
    try {
      const result = await exchanges.feesRate();
      assert.match(result, expected, 'Test failed');
      console.log('Test passed');
    } catch (err) {
      console.log(err);
    }
  }
  // 12
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n12. Tests for transactionInfo'
    );

    const btcHash =
      '8a6f09e9746b7b6f478000835b699565fede84e1485e637e34c69769fcc5968c';
    const dashHash =
      '2494f91b633266909084f967d9f0ced7a53064249aea9ca294c4c528e0606b59';
    const dogeHash =
      '1c23dd84d4041c187b110714fa8a6827680123036350daa8a40fb1c4cf044825';
    const ltcHash =
      '98589bde2f6e39c0ae7c2339bda8363f72080eb6f6269d04c8d17b86bcafa049';
    const btcExpected = '\n' +
      'Satoshis sent: 210936\n' +
      'Fee in satoshis: 12572\n' +
      'Transaction size in bytes: 215\n' +
      'Transaction preference: medium\n' +
      'Received at: 2021-06-02T12:31:59.994Z\n' +
      'Confirmed at: 2021-06-02T12:32:57Z';
    const dashExpected = '\n' +
      'Satoshis sent: 30851258\n' +
      'Fee in satoshis: 25086\n' +
      'Transaction size in bytes: 225\n' +
      'Transaction preference: high\n' +
      'Received at: 2021-06-02T12:34:58.549Z\n' +
      'Confirmed at: 2021-06-02T12:36:04Z';
    const dogeExpected = '\n' +
      'Satoshis sent: 249757626028\n' +
      'Fee in satoshis: 216908020\n' +
      'Transaction size in bytes: 226\n' +
      'Transaction preference: high\n' +
      'Received at: 2021-06-02T12:04:25.207Z\n' +
      'Confirmed at: 2021-06-02T12:05:25Z';
    const ltcExpected = '\n' +
      'Satoshis sent: 67835404\n' +
      'Fee in satoshis: 1660\n' +
      'Transaction size in bytes: 247\n' +
      'Transaction preference: low\n' +
      'Received at: 2021-06-02T12:04:51.983Z\n' +
      'Confirmed at: 2021-06-02T12:12:31Z';

    //1-4 work, 5-11 predictable errors
    const tests = [
      [1, btcHash,        btcExpected,        'Bitcion hash'                 ],
      [2, dashHash,       dashExpected,       'Dash hash'                    ],
      [3, dogeHash,       dogeExpected,       'Doge hash'                    ],
      [4, ltcHash,        ltcExpected,        'Litecoin hash'                ],
      [1, btcHash,        dashExpected,       'Dash hash for BTC transaction'],
      [3, dogeHash + 'a', dogeExpected,       'Wrong DOGE hash length'       ],
      [6, btcHash,        btcExpected,        '6 number'                     ],
      [2, 0,              dashExpected,       '0 hash'                       ],
      [1, dogeHash,       dogeExpected,       'DOGE hash for BTC transaction'],
      [4, ltcHash,        ltcExpected + '\n', 'Expected !== Actual'          ],
      [Number.NaN, -2,    0,                   'Number.NaN'                  ],
    ];

    const results = [];
    for (const test of tests) {
      const [number, hash, expected, name] = test;
      let result;
      try {
        result = await exchanges.transactionInfo(number, hash);
        assert.strictEqual(result, expected, `Error in test "${name}"`);
      } catch (err) {
        const { message } = err;
        let { operator } = err;
        if (!operator) operator = 'insideFunction';
        results.push({ message, number, hash, operator });
      }
    }
    console.table(results);
  }
  process.exit();
})();
