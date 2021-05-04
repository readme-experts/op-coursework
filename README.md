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
_Credits to [National Bank of Ukraine](https://bank.gov.ua/en/)_

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
* Andrii Vostrikov — https://github.com/NeptunePurpleHeart
* Vladyslav Yaroshchuk — https://github.com/thank1ess

## License
This program is distributed under an [MIT License](https://github.com/MrPaschenko/op-coursework/blob/master/LICENSE).
