'use strict';

const chalk = require('chalk');
const Combinatorics = require('js-combinatorics');
const shuffle = require('knuth-shuffle').knuthShuffle;

const SYMS = {};
const names = [
  'Purple', 'Green', 'Orange', 
  'Solid', 'Striped', 'Open', 
  'Pill', 'Squiggle', 'Diamond'
];
names.forEach((s) => SYMS[s] = Symbol(s));
const ColorMap = {
  Purple: chalk.magenta,
  Green: chalk.green,
  Orange: chalk.red
};
const ShapeMap = {
  Pill: 'O',
  Squiggle: '~',
  Diamond: '\u25ca'
};
const FillMap = {
  Solid: '|',
  Striped: '/',
  Open: '[]'
};

function different(v) {
  return (v[0] !== v[1]) && (v[0] !== v[2]) && (v[1] !== v[2]);
}
function same(v) {
  return (v[0] === v[1]) && (v[0] === v[2]);
}
function sameOrDiff(obs, prop) {
  const props = obs.map((i) => i[prop]);
  return same(props) || different(props);
}

class Card {
  constructor(num, color, fill, shape) {
    this.num = num;
    this.color = SYMS[color];
    this.fill = SYMS[fill];
    this.shape = SYMS[shape];
    this.str = ColorMap[color](`${Array(num+1).join(ShapeMap[shape])} ${FillMap[fill]}`);
  }
  inspect() {
    return this.str;
  }
  isSet(c2, c3) {
    const obs = [this, c2, c3];
    return sameOrDiff(obs, 'num') && 
           sameOrDiff(obs, 'color') && 
           sameOrDiff(obs, 'fill') &&
           sameOrDiff(obs, 'shape'); 
  }
}
exports.Card = Card;

class Deck {
  constructor() {
    let it =  Combinatorics.cartesianProduct(
      [1,2,3], 
      names.slice(0,3), 
      names.slice(3,6),
      names.slice(6,9));
    this.cards = it.map((props) => new Card(...props)); 
  }
  shuffle() {
    shuffle(this.cards);
    return this;
  }
  deal(num) {
    // deal off bottom is likely much faster, since you don't have to realloc
    // and move
    return this.cards.splice(-num);
  }
  inspect() { return this.cards; }
}
exports.Deck = Deck;