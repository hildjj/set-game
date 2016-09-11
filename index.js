'use strict';
const Combinatorics = require('js-combinatorics');
const {Card, Deck} = require('./card');

let deck = new Deck().shuffle();
let hand = deck.deal(9);
let set;
let count = 0; 
let almost = false;
while (true) {
  if (!set || (hand.length < 12)) {
    let cards = deck.deal(3);
    if (cards.length === 0) {
      almost = true;
    } else {
      hand = hand.concat(cards);
    }
  }
  if (hand.length < 3) {
    break;
  }
  let it = Combinatorics.combination(hand, 3);
  it.lazyFilter(([i,j,k]) => i.isSet(j,k));
  set = it.next();
  if (set) {
    console.log(count++, hand.length, set);
    set.forEach((obj) => {
      let ind = hand.indexOf(obj);
      if (ind === -1) { throw new Error('wat');}
      hand.splice(ind,1);
    })
  } else {
    if (almost) {
      break;
    }
  }
}
