'use strict';

const { Crypto } = require('./crypto.js');
const exchanges = require('./exchanges.js');
const { colors } = require('./promised.js');
const assert = require('assert').strict;

const crypto = new Crypto();

(async () => {
  // 1
  {
    console.log('\n' +
      '1. Tests for currencyToCrypto\n'
    );
    const expected = /:\s\d/;
    // 1-3 work, 4-7 predictable errors
    const tests = [
      ['eur', expected,  '\'eur\' failed'              ],
      ['usd', expected,  '\'usd\' failed'              ],
      ['uah', expected,  '\'uah\' failed'              ],
      [5,     expected,  '5'                           ],
      [null,  expected,  'null'                        ],
      ['buu', expected,  '\'buu\' failed'              ],
      ['irl', /Oleksyi/, '\'irl\': Actual !== Expected'],
    ];

    const results = [];
    for (const test of tests) {
      const [currency, expected, name] = test;
      let result;
      try {
        result = await crypto.currencyToCrypto(currency);
        assert.match(result, expected, `Error in test "${name}"`);
      } catch (err) {
        const { message } = err;
        let { operator } = err;
        if (!operator) operator = 'insideFunction';
        results.push({ message, currency, operator });
      }
    }
    console.table(results);
  }
  // 2
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n2. Test for topFiveCurrencies\n'
    );
    // Nothing to test except of API correctness
    const expected = /^\d.\s\D/;
    try {
      const result = await crypto.topFiveCurrencies();
      assert.match(result, expected, 'Test failed');
      console.log(colors.green, 'Test passed', colors.reset);
    } catch (err) {
      console.log(colors.red, err, colors.reset);
    }
  }
  // 3
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n3. Tests for currencyPriceVolume\n'
    );
    const expected = /is:\s\d/;
    // 1-3 work, 4-6 predictable errors
    const tests = [
      ['BTC, USD',  expected, '\'BTC, USD\' failed' ],
      ['ETH, UAH',  expected, '\'ETH, UAH\' failed' ],
      ['LTC, EUR',  expected, '\'DOGE, EUR\' failed'],
      [0,           expected, '0'                   ],
      ['DOGE, RUB', /Hola/,   'Actual !== Expected' ],
      [null,        expected, 'null'                ],
    ];

    const results = [];
    for (const test of tests) {
      const [text, expected, name] = test;
      let result;
      try {
        result = await crypto.currencyPriceVolume(text);
        assert.match(result, expected, `Error in test "${name}"`);
      } catch (err) {
        const { message } = err;
        let { operator } = err;
        if (!operator) operator = 'insideFunction';
        results.push({ message, text, operator });
      }
    }
    console.table(results);
  }
  // 5
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n5. Test for genWalletFeature\n'
    );
    const expected = /private:\w/;
    // 1-3 work, 4-6 predictable errors
    const tests = [
      [1,    expected, '\'1\' failed'       ],
      [2,    expected, '\'2\' failed'       ],
      [3,    expected, '\'3\' failed'       ],
      [2,    /moooo/,  'Actual !== Expected'],
      [5,   expected, '\'5\' failed'      ],
      [null, expected, '\'null\' failed'    ],
    ];

    const results = [];
    for (const test of tests) {
      const [selection, expected, name] = test;
      let result;
      try {
        result = await exchanges.genWalletFeature(selection);
        assert.match(result, expected, `Error in test "${name}"`);
      } catch (err) {
        const { message } = err;
        let { operator } = err;
        if (!operator) operator = 'insideFunction';
        results.push({ message, selection, operator });
      }
    }
    console.table(results);
  }
  // 6
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n6. Tests for btcAdrBalance\n'
    );
    const adr1 = 'bc1qgdjqv0av3q56jvd82tkdjp' +
      'y7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97';
    const adr2 = '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo';
    const adr3 = '35hK24tcLEWcgNA4JxpvbkNkoAcDGqQPsP';
    const adr1Expected = 'Total received: 91503610546763 satoshis\n' +
      'Total send: 74852511963191 satoshis\n' +
      'Balance: 16651098583572 satoshis';
    const adr2Expected = 'Total received: 108789803024180 satoshis\n' +
      'Total send: 79447097357947 satoshis\n' +
      'Balance: 29342705666233 satoshis';
    const adr3Expected = 'Total received: 24789994776388 satoshis\n' +
      'Total send: 12844829067961 satoshis\n' +
      'Balance: 11945165708427 satoshis';
    // 1-3 work, 4-6 predictable errors
    const tests = [
      [adr1, adr1Expected, 'adr1 failed'  ],
      [adr2, adr2Expected, 'adr2 failed'  ],
      [adr3, adr3Expected, 'adr3 failed'  ],
      ['ss', adr1Expected, 'ss'           ],
      [123,  adr2Expected, '123'          ],
      [null, 0,            'null, 0'      ],
    ];

    const results = [];
    for (const test of tests) {
      const [adr, expected, name] = test;
      let result;
      try {
        result = await exchanges.btcAdrBalance(adr);
        assert.strictEqual(result, expected, `Error in test "${name}"`);
      } catch (err) {
        const { message } = err;
        let { operator } = err;
        if (!operator) operator = 'insideFunction';
        results.push({ message, adr, operator });
      }
    }
    console.table(results);
  }
  // 7
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n7. Test for monoExchange\n'
    );
    const expected = 'USD';
    try {
      const result = await exchanges.monoExchange();
      assert.strictEqual(result, expected, 'Test failed');
      console.log(colors.green, '\nTest passed', colors.reset);
    } catch (err) {
      console.log(colors.red, err, colors.reset);
    }
  }
  // 8
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n8. Tests for cryptoNews\n'
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
  // 9
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n9. Tests for privatExchange\n'
    );
    const expected = /^\d/;
    // 1-4 work, 5-7 predictable errors
    const tests = [
      [1,    expected, '1 failed'           ],
      [2,    expected, '2 failed'           ],
      ['1',  expected, '\'1\' failed'       ],
      ['2',  expected, '\'2\' failed'       ],
      [3,    expected, 'number 3'           ],
      [null, expected, 'null'               ],
      [2,    /^\D/,    'Actual !== Expected'],
    ];

    const results = [];
    for (const test of tests) {
      const [userChoice, expected, name] = test;
      let result;
      try {
        result = await exchanges.privatExchange(userChoice);
        assert.match(result, expected, `Error in test "${name}"`);
      } catch (err) {
        const { message } = err;
        let { operator } = err;
        if (!operator) operator = 'insideFunction';
        results.push({ message, userChoice, operator });
      }
    }
    console.table(results);
  }
  // 10
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n10. Test for feesRate\n'
    );
    // Nothing to test except of API correctness
    const expected = /fast:\s\d/;
    try {
      const result = await exchanges.feesRate();
      assert.match(result, expected, 'Test failed');
      console.log(colors.green, 'Test passed', colors.reset);
    } catch (err) {
      console.log(colors.red, err, colors.reset);
    }
  }
  // 11
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n11. Test for currencyCodeNumber\n'
    );
    // All the magic numbers and string are taken from codeList.json *_*
    // 1-4 work, 5-8 predictable errors
    const tests = [
      [8,          'ALL', '8 failed'           ],
      ['DZD',      12,    '\'DZD\' failed'     ],
      ['AUD',      36,    '\'AUD\' failed'     ],
      ['108',      'BIF', '\'108\' failed'     ],
      [144,        'UZK', 'Actual !== Expected'],
      ['ZPO',      8,     '\'ZPO\' failed'     ],
      [null,       null,  'null failed'        ],
      [Number.NaN, 15,    'NaN failed'         ],
    ];

    const results = [];
    for (const test of tests) {
      const [request, expected, name] = test;
      let result;
      try {
        result = await exchanges.currencyCodeNumber(request);
        assert.strictEqual(result, expected, `Error in test "${name}"`);
      } catch (err) {
        const { message } = err;
        let { operator } = err;
        if (!operator) operator = 'insideFunction';
        results.push({ message, request, operator });
      }
    }
    console.table(results);
  }
  // 12
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n12. Tests for transactionInfo\n'
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
  // 13
  {
    console.log('\n' +
      '----------------------------------------------------------------------' +
      '\n13. Test for nbuAlternative\n'
    );
    // Nothing to test except of API correctness
    const expected = /^[A-Z]/;
    try {
      const result = await exchanges.nbuAlternative();
      assert.match(result, expected, 'Test failed');
      console.log(colors.green, 'Test passed', colors.reset);
    } catch (err) {
      console.log(colors.red, err, colors.reset);
    }
  }
  process.exit();
})();
