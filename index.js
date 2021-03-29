'use strict';

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = str => new Promise(resolve => rl.question(str, resolve));

async function start() {
  const answer = await question('What do you want to do?\n');
  if (answer.toLowerCase() === 'hello') console.log('World');
  rl.close();
}

start();


