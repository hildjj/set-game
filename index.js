'use strict'
const {Hand} = require('./card')

let set = null
let count = 0
const hand = new Hand()
hand.deal(12)
while (!hand.done) {
  set = hand.firstSet()
  if (set) {
    console.log(count++, hand.length, set)
    hand.remove(set)
  } else if (hand.last) {
    break
  }
  if (!set || (hand.length < 12)) {
    hand.deal(3)
  }
}
