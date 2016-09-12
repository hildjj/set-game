'use strict'

const chalk = require('chalk')
const {Card, Hand} = require('./card')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

let hand = new Hand()
rl.on('line', (line) => {
  try {
    const c = new Card(line)
    console.log(c)
    hand.cards.push(c)
  } catch (e) {
    console.log('   ', chalk.bgRed(e.message))
  }
})

rl.on('close', () => {
  console.log(hand.firstSet())
})
