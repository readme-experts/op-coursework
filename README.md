# OP Coursework
This little program is dedicated to work with any kinds of currency: cryptocurrencies (like BTC, ETH etc.) or the usual ones (USD, EUR etc.).

## Installation
1. Clone the repository:
```bash
$ git clone https://github.com/MrPaschenko/op-coursework
```
2. Open folder:
```bash
$ cd op-coursework
```
3. Run the program:
```bash
$ node index.js
```
This app has no dependencies so you don't have to install them via npm.

## 1. Currency to BTC exchange rate
Get BTC exchange rate to any currency you want just by entering its [code](https://www.iban.com/currency-codes).
```
Select action
>1
Type currency you want to convert
>usd
USD: 53986.32
```
```
Select action
>1
Type currency you want to convert
>eur
EUR: 45036.28
```
_Credits to [CryptoCompare](https://www.cryptocompare.com/)_

## 2. Top five crypto by volume
Get top 5 cryptocurrencies by its volume.
```
Select action
>2
1. Ethereum
2. Dogecoin
3. Bitcoin
4. XRP
5. Bitcoin Cash
```
_Credits to [CryptoCompare](https://www.cryptocompare.com/)_

## 3. Currency 24 h volume
Get pair exchange rate for past 24 hours by entering two currency codes splitting them by coma, but not using space (like `usd,btc`).
```
Select action
>3
Type curr you want to get 24h volume of/res curr
usd,btc
The lowest price  for 24 hours is: 0.00001747 btc
The highest price for 24 hours is: 0.00001877 btc
24 hour price differance: 0.00 btc
```
_Credits to [CryptoCompare](https://www.cryptocompare.com/)_

## 4. Exchange rates of UAH from bank.gov.ua
Get official exchange rates.
```
Select action
>4
┌─────────┬──────────┬────────────────┬───────────────┐
│ (index) │ currency │ exchangeAmount │ exchangeRate  │
├─────────┼──────────┼────────────────┼───────────────┤
│    0    │  'AUD'   │       1        │ '21,6242 UAH' │
│    1    │  'BYN'   │       10       │ '10,8526 UAH' │
│    2    │  'BGN'   │       1        │ '17,204 UAH'  │
│    3    │  'KRW'   │      100       │ '2,5053 UAH'  │
│    4    │  'HKD'   │       1        │ '3,5746 UAH'  │
│    5    │  'DKK'   │       1        │ '4,5246 UAH'  │
│    6    │  'USD'   │       1        │  '27,75 UAH'  │
│    7    │  'EUR'   │       1        │ '33,6427 UAH' │
│    8    │  'EGP'   │       1        │ '1,7719 UAH'  │
│    9    │  'JPY'   │       10       │ '2,5453 UAH'  │
│   10    │  'PLN'   │       1        │ '7,3664 UAH'  │
│   11    │  'INR'   │       10       │  '3,748 UAH'  │
│   12    │  'CAD'   │       1        │ '22,5812 UAH' │
│   13    │  'HRK'   │       1        │ '4,4529 UAH'  │
│   14    │  'MXN'   │       1        │ '1,3887 UAH'  │
│   15    │  'MDL'   │       1        │ '1,5563 UAH'  │
│   16    │  'ILS'   │       1        │ '8,5482 UAH'  │
│   17    │  'NZD'   │       1        │ '20,1368 UAH' │
│   18    │  'NOK'   │       1        │ '3,3928 UAH'  │
│   19    │  'ZAR'   │       10       │ '1,9469 UAH'  │
│   20    │  'RUB'   │       10       │ '3,7355 UAH'  │
│   21    │  'RON'   │       1        │ '6,8345 UAH'  │
│   22    │  'IDR'   │      1000      │ '1,9182 UAH'  │
│   23    │  'SAR'   │       1        │ '7,3992 UAH'  │
│   24    │  'SGD'   │       1        │ '20,9323 UAH' │
│   25    │  'XDR'   │       1        │ '39,8933 UAH' │
│   26    │  'KZT'   │      100       │ '6,4823 UAH'  │
│   27    │  'TRY'   │       1        │ '3,3738 UAH'  │
│   28    │  'HUF'   │      100       │ '9,3302 UAH'  │
│   29    │  'GBP'   │       1        │ '38,7015 UAH' │
│   30    │  'CZK'   │       1        │ '1,3028 UAH'  │
│   31    │  'SEK'   │       1        │ '3,3261 UAH'  │
│   32    │  'CHF'   │       1        │ '30,5163 UAH' │
│   33    │  'CNY'   │       1        │ '4,2887 UAH'  │
└─────────┴──────────┴────────────────┴───────────────┘
```
_Credits to [National Bank of Ukraine](https://bank.gov.ua/)_

## 5. Create wallet on BlockCypher
#### WARNING! Experimental feature.
Create cryptocurrency wallet on [BlockCypher](https://www.blockcypher.com/).
```
Select action
>5
 Choose which wallet do you want to make:
  1 - Bitcoin;
  2 - Ethereum;
  3 - Dogecoin;
  Type anything to exit.
Select action
>1
Wallet was successfully created! Your wallet data:
$$$$
```
_Credits to [BlockCypher](https://www.blockcypher.com/)_

## 6. BTC Address Balance
Get BTC address balance by using [BlockCypher](https://www.blockcypher.com/).
```
Select action
>6
Write the address you want to get balance of
>address (instance: 13oiPCfq5xMePgVRmBvoxa2nXYHue7XRgm )
Total received: $ satoshis
Total send: $ satoshis
Balance: $ satoshis
```
_Credits to [BlockCypher](https://www.blockcypher.com/)_

## 7. Exchange rates of UAH from monobank.ua
Get exchange rates from one of the most popular banks of Ukraine.
```
Select action
>7
┌─────────┬───────────────┬───────────────┬──────────────┬─────────┬──────────┬───────────┐
│ (index) │ currencyCodeA │ currencyCodeB │     date     │ rateBuy │ rateSell │ rateCross │
├─────────┼───────────────┼───────────────┼──────────────┼─────────┼──────────┼───────────┤
│    0    │     'USD'     │     'UAH'     │ '15.5.2021'  │  27.5   │ 27.7001  │           │
│    1    │     'EUR'     │     'UAH'     │ '15.5.2021'  │  33.25  │ 33.6496  │           │
│    2    │     'RUB'     │     'UAH'     │ '15.5.2021'  │  0.36   │   0.39   │           │
│    3    │     'EUR'     │     'USD'     │ '15.5.2021'  │  1.204  │  1.218   │           │
│    4    │     'PLN'     │     'UAH'     │ '16.5.2021'  │  7.35   │   7.5    │    7.5    │
...
```
_Credits to [monobank](https://www.monobank.ua/)_

## 8. Recent crypto news 
Read recent news crypto news.
````
Select action
>8

Five most recent articles on cryptocurrency:
1. Puerto Rico’s Crypto Tax Haven Dreams are on the Rocks
2. Billionaire investor Bill Ackman says he wouldn’t invest in bitcoin because it is purely speculative
3. Biden's $6 Trillion Budget Could Fuel Inflation Fears And Bitcoin Gains
4. Bitcoin Challenges $40K Again Following Biden’s $6 Trillion Spending Budget Reveal
5.Crypto Mouthpieces Need Muting: Why There’s No Coordinated Bitcoin FUD

Enter number of article you'd like to read:
>1

Like the IRS in the mainland US, the Puerto Rican tax authority hasn’t issued definite guidance on crypto.The post Puerto Rico’s Crypto Tax Haven Dreams are on the Rocks appeared first on Blockworks.

Clear menu(y/n)?
>choice
````
Credits to [CryptoCompare](https://www.cryptocompare.com/)

## 9. Exchange rates of UAH from privatbank.ua
Get exchange rates from one of the most popular banks of Ukraine.
```
Select action
>9
Do you want to get cash rate (1) or non-cash rate (2)?
1
┌─────────┬───────┬──────────┬──────────────┬──────────────┐
│ (index) │  ccy  │ base_ccy │     buy      │     sale     │
├─────────┼───────┼──────────┼──────────────┼──────────────┤
│    0    │ 'USD' │  'UAH'   │  '27.20000'  │  '27.60000'  │
│    1    │ 'EUR' │  'UAH'   │  '33.10000'  │  '33.70000'  │
│    2    │ 'RUR' │  'UAH'   │  '0.36000'   │  '0.39000'   │
│    3    │ 'BTC' │  'USD'   │ '35067.3591' │ '38758.6601' │
└─────────┴───────┴──────────┴──────────────┴──────────────┘
```
Keep in mind that __there are two types of rate in PrivatBank__. 
The first one is cash rate and the second one is non-cash rate.

Usually non-cash rate is more profitable :) 

_Credits to [PrivatBank](https://privatbank.ua/)_

## 10. Cryptocurrency fee rates
Get cryptocurrency fee rates (Bitcoin, Bitcoin-Cash, Dogecoin, Dash, Litecoin).
```
Select action
>10
These are fee rates for some cryptocurrencies:
BITCOIN
fast: 0.00000208
slow: 0.00000032
standard: 0.00000073


BITCOIN-CASH
fast: 0.00000004
slow: 0.00000003
standard: 0.00000004


DOGECOIN
fast: 0.00523561
slow: 0.00520833
standard: 0.00522197


DASH
fast: 0.00000005
slow: 0.00000003
standard: 0.00000004


LITECOIN
fast: 0.00000026
slow: 0.00000023
standard: 0.00000025


Clear menu(y/n)?
>n
```

## 11. Show currency code by its number and vice versa
Get currency number entering its code and currency code entering its number.
```
Select action
>11
Enter currency code or its number:
>usd
840
```
```
Select action
>11
Enter currency code or its number:
>980
uah
```
## 12. Transaction info by its hash
Find out information about any btc/dash/doge/ltc transaction by its hash.
````
Select action
11

List of cryptos:
1. Bitcoin
2. Dash
3. Dogecoin
4. Litecoin

Enter the number of crypto from the list above you'd to like to input hash of: 
3

Enter the hash of transaction you'd like to get info about: 
645127c390c019f61b255ea79b15d8ebb5203e9febbe76b0a7531225e20275ff

Satoshis sent: 14794235305186972
Fee in satoshis: 100000000
Transaction size in bytes: 226
Transaction preference: high
Received at: 2021-05-27T15:23:38.019Z
Confirmed at: 2021-05-27T15:24:00Z
````
Credits to [BlockCypher](https://www.blockcypher.com/)

## 13. Exchange rates of UAH from bank.gov.ua (Alternative source)
Get official exchange rates.
```
Select action
>13
┌─────────┬──────┬──────────────────────────────────────┬────────────┬───────┬──────────────┐
│ (index) │ r030 │                 txt                  │    rate    │  cc   │ exchangedate │
├─────────┼──────┼──────────────────────────────────────┼────────────┼───────┼──────────────┤
│    0    │  36  │        'Австралійський долар'        │  21.1396   │ 'AUD' │ '31.05.2021' │
│    1    │ 124  │          'Канадський долар'          │  22.7079   │ 'CAD' │ '31.05.2021' │
│    2    │ 156  │          'Юань Женьміньбі'           │   4.3126   │ 'CNY' │ '31.05.2021' │
│    3    │ 191  │                'Куна'                │   4.4408   │ 'HRK' │ '31.05.2021' │
│    4    │ 203  │            'Чеська крона'            │   1.3118   │ 'CZK' │ '31.05.2021' │
│    5    │ 208  │           'Данська крона'            │   4.4899   │ 'DKK' │ '31.05.2021' │
...
```
_Credits to [National Bank of Ukraine](https://bank.gov.ua/)_

## Save results to .txt file
To the No. 1-3 there is also additional feature available: you can save results to text file by typing `1` after creating a request.
```
Select action
>1
Type currency you want to convert
>usd
USD: 54132.18

Print 1 to save results
>1
Write the name of txt file to save your results
>btc to usd
```
After that you can find file `btc to usd.txt` in root folder. It will contain next information:
```
USD: 54132.18
```

## Themes used in work
https://github.com/MrPaschenko/op-coursework/blob/master/src/themes.md

## Authors
* Dmytro Pashchenko — https://github.com/MrPaschenko
* Ivan Labiak — https://github.com/ILabiak
* Andrii Vostrikov — https://github.com/NekoSuimin
* Vladyslav Yaroshchuk — https://github.com/thank1ess

## Contributing
If you have any ideas of how to improve the program, feel free to add new Issues on [Issues page](https://github.com/MrPaschenko/op-coursework/issues).

You can also create Pull Requests on [Pull Requests page](https://github.com/MrPaschenko/op-coursework/pulls), if you are famliar with JavaScript and Node.js.

## License
This program is distributed under an [MIT License](https://github.com/MrPaschenko/op-coursework/blob/master/LICENSE).
