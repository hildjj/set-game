'use strict'
const {Hand} = require('./card')

let set = null
let count = 0
const hand = new Hand()
hand.deal(12)
console.log(hand)
while (!hand.done) {
  set = hand.firstSet()
  if (set) {
    console.log(count++, hand.length, set)
    hand.remove(set)
  } else {
    if (hand.last) {
      break
    }
    hand.deal(Math.max(12 - hand.length, 3))
    console.log(hand)
  }
}
