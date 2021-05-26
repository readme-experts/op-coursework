'use strict';

const promised = require('./promised.js');

const errorHandlerWrapped = promised.errorWrapper(promised.handler);

const safeGet = errorHandlerWrapped(promised.getRequest);
const safePost = errorHandlerWrapped(promised.postRequest);

class Wallet {
  #token;
  #keys;

  constructor(currency, token) {
    this.defaultUrl = 'api.blockcypher.com';
    this.defaultPath = `/v1/${currency}/main/`;
    this.#token = token;
  }

  async createWallet() {
    const path = this.defaultPath + `addrs?token=`;
    const data = JSON.stringify({
      token: this.#token,
    });
    const options = {
      method: 'POST',
      hostname: this.defaultUrl,
      path,
      headers: {},
    };
    const result = await safePost(options, data);
    this.#keys = result;
    return result;
  }
  async getAdrsBalance(adrs) {
    const path =  `/v1/btc/main/addrs/${adrs}/balance`;
    const link = 'https://' + this.defaultUrl + path;
    const result = [];
    const getInfo = await safeGet(link);
    result.push(`Total received: ${getInfo.total_received} satoshis`);
    result.push(`Total send: ${getInfo.total_sent} satoshis`);
    result.push(`Balance: ${getInfo.balance} satoshis`);
    console.log(`${result.join('\n')}\n`);
    return result;
  }
  get keys() {
    if (!this.#keys) return null;
    const walletInfo = [];
    const keys = Object.keys(this.#keys);
    for (const key of keys) {
      walletInfo.push(`${key}:${this.#keys[key]}\n`);
    }
    return walletInfo;
  }
}

module.exports = {
  Wallet
};

