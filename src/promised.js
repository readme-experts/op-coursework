'use strict';

const https = require('https');
const readline = require('readline');
const { spawn } = require('child_process');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = str => new Promise(resolve => rl.question(str, resolve));
const getRequest = async url => new Promise((resolve, reject) => {
  https.get(url, async res => {
    const buffers = [];
    for await (const chunk of res) buffers.push(chunk);
    const data = JSON.parse(Buffer.concat(buffers).toString());
    if (data.Response === 'Error') reject(data.Message);
    resolve(data);
  })
    .on('error', reject);
});

const postRequest = (options, data) => new Promise((resolve, reject) => {
  const req = https.request(options, async res => {
    const buffers = [];
    for await (const chunk of res) buffers.push(chunk);
    const reqData = JSON.parse(Buffer.concat(buffers).toString());
    resolve(reqData);
  });
  req.write(data);
  req.on('error', reject);
  req.end();
});

const promiseSpawn = (lang, path) => new Promise((resolve, reject) => {
  const pyProcess = spawn(lang, [path]);
  pyProcess.stdout.on('data', data => resolve(JSON.parse(data)));
  pyProcess.stderr.on('data', err => reject(err));
});

const errorWrapper = handleError => func => (...args) =>
  func(...args).catch(handleError);

const escapeChars = { lt: '<', gt: '>', quot: '"', apos: '\'', amp: '&' };

function decodeString(str) {
  return str.replace(/&([^;]+);/g, (entity, entityCode) => {
    let match;
    if (entityCode in escapeChars) {
      return escapeChars[entityCode];
    } else if (entityCode.match(/^#x([\da-fA-F]+)$/)) {
      match = entityCode.match(/^#x([\da-fA-F]+)$/);
      return String.fromCharCode(parseInt(match[1], 16));
    } else if (entityCode.match(/^#(\d+)$/)) {
      match = entityCode.match(/^#(\d+)$/);
      return String.fromCharCode(~~match[1]);
    } else return entity;
  });
}

module.exports = {
  question,
  getRequest,
  postRequest,
  promiseSpawn,
  errorWrapper,
  escapeChars,
  decodeString,
};
