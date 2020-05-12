'use strict'
const {Hand} = require('./card')

const argv = process.argv.slice(2)

const hand = new Hand()
hand.play()

if (argv.shift() === '--html') {
  console.log(hand.html())
} else {
  console.log(hand)
}
