'use strict';

const fs = require('fs');
const https = require('https');
const readline = require('readline');
const { spawn } = require('child_process');

const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const handler = e => {
  console.log(`Something gone wrong, error:\n${e}`);
  process.exit();
};

const classHandler =
  (method, Context, ...constr) =>
    (...args) => {
      const ctx = new Context(...constr);
      return method.apply(ctx, args).catch(handler);
    };

const question = str => new Promise(resolve => rl.question(str, resolve));
const getRequest = async url =>
  new Promise((resolve, reject) => {
    https
      .get(url, async res => {
        const buffers = [];
        for await (const chunk of res) buffers.push(chunk);
        const data = JSON.parse(Buffer.concat(buffers).toString());
        if (data.Response === 'Error') reject(data.Message);
        resolve(data);
      })
      .on('error', reject);
  });

const postRequest = (options, data) =>
  new Promise((resolve, reject) => {
    const req = https.request(options, async res => {
      const buffers = [];
      for await (const chunk of res) buffers.push(chunk);
      try {
        const reqData = JSON.parse(Buffer.concat(buffers).toString());
        resolve(reqData);
      } catch (e) {
        handler(buffers.toString() + '\n' + e);
      }
    });
    req.write(data);
    req.on('error', reject);
    req.end();
  });

const promiseSpawn = (lang, path) =>
  new Promise((resolve, reject) => {
    const pyProcess = spawn(lang, [path]);
    pyProcess.stdout.on('data', data => resolve(JSON.parse(data)));
    pyProcess.stderr.on('data', err => reject(err));
  });

const errorWrapper =
  handler =>
    func =>
      (...args) =>
        func(...args).catch(handler);

const classWrapper = (Class, handler, ...args) => {
  if (Object.getOwnPropertyNames(Class.prototype).length < 2) {
    return Class;
  }
  const cond = (proto, prop) =>
    hasOwn(proto, prop) && typeof proto[prop] === 'function';
  for (const prop in Object.getOwnPropertyDescriptors(Class.prototype)) {
    if (cond(Class.prototype, prop) && prop !== 'constructor') {
      Class.prototype[prop] = handler(Class.prototype[prop], Class, ...args);
    }
  }
  return Class;
};

const escapeChars = { lt: '<', gt: '>', quot: '"', apos: '\'', amp: '&' };

const regExp = [/&([^;]+);/g, /^#x([\da-fA-F]+)$/, /^#(\d+)$/];

function decodeString(str) {
  return str.replace(regExp[0], (entity, entityCode) => {
    let match;
    if (entityCode in escapeChars) {
      return escapeChars[entityCode];
    } else if (entityCode.match(regExp[1])) {
      match = entityCode.match(regExp[1]);
      return String.fromCharCode(parseInt(match[1], 16));
    } else if (entityCode.match(regExp[2])) {
      match = entityCode.match(regExp[2]);
      return String.fromCharCode(~~match[1]);
    } else return entity;
  });
}

const writeFile = async resultTxt => {
  const select = parseInt(await question('Print 1 to save results\n'));
  if (select === 1) {
    const fileName = 'Write the name of txt file to save your results\n';
    const txtName = await question(fileName);
    fs.writeFileSync(`${txtName}.txt`, resultTxt.join('\n'), 'utf8');
    return txtName;
  } else return;
};

module.exports = {
  question,
  writeFile,
  getRequest,
  postRequest,
  promiseSpawn,
  errorWrapper,
  decodeString,
  classWrapper,
  handler,
  classHandler,
};
