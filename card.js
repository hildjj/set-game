'use strict'

const util = require('util')
const chalk = require('chalk')
const Combinatorics = require('js-combinatorics')
const shuffle = require('knuth-shuffle').knuthShuffle

const FILLS = ['Solid', 'Hatched', 'Open']
const COLORS = ['purple', 'green', 'red']
const SHAPES = ['Pill', 'Squiggle', 'Diamond']

const FillMap = {
  Solid: '|',
  Hatched: '/',
  Open: '[]'
}
const ColorMap = {
  purple: chalk.magenta,
  green: chalk.green,
  red: chalk.red
}
const ShapeMap = {
  Pill: 'O',
  Squiggle: '~',
  Diamond: '\u25ca'
}

function different (v) {
  return (v[0] !== v[1]) && (v[0] !== v[2]) && (v[1] !== v[2])
}
function same (v) {
  return (v[0] === v[1]) && (v[0] === v[2])
}
function sameOrDiff (obs, prop) {
  const props = obs.map((i) => i[prop])
  return same(props) || different(props)
}

class Card {
  constructor (num, fill, color, shape) {
    if (typeof num === 'string') {
      this.num = parseInt(num[0])
      switch (num[1]) {
        case 'S':
        case 's':
          this.fill = 'Solid'
          break
        case 'H':
        case 'h':
          this.fill = 'Hatched'
          break
        case 'O':
        case 'o':
          this.fill = 'Open'
          break
        default:
          throw new Error(`Unknown fill ${num[1]}`)
      }
      switch (num[2]) {
        case 'P':
        case 'p':
          this.color = 'purple'
          break
        case 'G':
        case 'g':
          this.color = 'green'
          break
        case 'R':
        case 'r':
          this.color = 'red'
          break
        default:
          throw new Error(`Unknown color ${num[2]}`)
      }
      switch (num[3]) {
        case 'P':
        case 'p':
          this.shape = 'Pill'
          break
        case 'S':
        case 's':
          this.shape = 'Squiggle'
          break
        case 'D':
        case 'd':
          this.shape = 'Diamond'
          break
        default:
          throw new Error(`Unknown shape ${num[3]}`)
      }
    } else {
      this.num = num
      this.color = color
      this.fill = fill
      this.shape = shape
    }
    if (this.num < 1 || this.num > 3) {
      throw new Error('Number must be 1..3')
    }
  }

  inspect () {
    return ColorMap[this.color](`${Array(this.num + 1).join(ShapeMap[this.shape])} ${FillMap[this.fill]}`)
  }
  [util.inspect.custom] () {
    return this.inspect()
  }

  isSet (c2, c3) {
    const obs = [this, c2, c3]
    return sameOrDiff(obs, 'num') &&
      sameOrDiff(obs, 'color') &&
      sameOrDiff(obs, 'fill') &&
      sameOrDiff(obs, 'shape')
  }

  name () {
    return `${this.num}${this.fill[0]}${this.color[0]}${this.shape[0]}`
  }
}
exports.Card = Card

class Deck {
  constructor () {
    let it = Combinatorics.cartesianProduct(
      [1, 2, 3],
      FILLS,
      COLORS,
      SHAPES)
    this.cards = it.map((props) => new Card(...props))
  }
  shuffle () {
    shuffle(this.cards)
    return this
  }
  deal (num) {
    // deal off bottom; much faster
    return this.cards.splice(-num)
  }
  inspect () { return this.cards }
  [util.inspect.custom] () {
    return this.inspect()
  }
}
exports.Deck = Deck

class Hand {
  constructor (deck) {
    this.deck = deck || new Deck()
    this.deck.shuffle()
    this.cards = []
    this.last = false
    this.done = false
  }
  deal (num = 3) {
    if (this.done) {
      return []
    }
    let cards = this.deck.deal(num)
    if (cards.length === 0) {
      this.last = true
    } else {
      this.cards = this.cards.concat(cards)
    }
    if (this.cards.length < 3) {
      this.done = true
      return []
    }
    return this.cards
  }
  remove (card) {
    if (!Array.isArray(card)) {
      card = [card]
    }
    card.forEach((c) => {
      let ind = this.cards.indexOf(c)
      if (ind === -1) {
        throw new Error('Unknown card being removed')
      }
      this.cards.splice(ind, 1)
    })
  }
  combinations (num = 3) {
    return Combinatorics.combination(this.cards, num)
  }
  firstSet (num = 3) {
    if (this.length === 0) {
      return null
    }
    const it = this.combinations(num)
    it.lazyFilter(([i, j, k]) => i.isSet(j, k))
    return it.next()
  }
  get length () {
    return this.cards.length
  }
  inspect () {
    return this.cards
  }
  [util.inspect.custom] () {
    return this.inspect()
  }
}
exports.Hand = Hand
