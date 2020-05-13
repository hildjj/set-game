'use strict'

const util = require('util')
const chalk = require('chalk')
const Combinatorics = require('js-combinatorics')
const shuffle = require('knuth-shuffle').knuthShuffle
const Formatted = require('./formatted')

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

const FILLS = Object.keys(FillMap)
const COLORS = Object.keys(ColorMap)
const SHAPES = Object.keys(ShapeMap)

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

class Card extends Formatted {
  constructor (num, fill, color, shape) {
    super()
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
    const txt = `${Array(this.num + 1).join(ShapeMap[this.shape])} ${FillMap[this.fill]}`
    return ColorMap[this.color](txt.padEnd(7))
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

  static compare (a, b) {
    let ret = a.num - b.num
    if (ret === 0) {
      ret = a.color.localeCompare(b.color)
      if (ret === 0) {
        ret = a.fill.localeCompare(b.fill)
        if (ret === 0) {
          ret = a.shape.localeCompare(b.shape)
        }
      }
    }
    return ret
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

class Set extends Formatted {
  static count = 0
  constructor (cards) {
    super()
    this.count = ++Set.count
    this.cards = cards.sort(Card.compare)
  }
}
exports.Set = Set

/**
 * One set of cards out on the table at a time.  This is a snapshot of
 * what was shown.
 */
class Board extends Formatted {
  constructor (cards) {
    super()
    this.cards = [...cards]
    this.sets = []
  }
}
exports.Board = Board

class Hand extends Formatted {
  constructor (deck) {
    super()
    this.deck = deck || new Deck()
    this.deck.shuffle()
    this.cards = []
    this.history = []
  }
  play () {
    this.deal(12)
    // we're done when there are:
    // no more sets to take off the board and
    // no more cards in the deck
    while (true) {
      const set = this.firstSet()
      if (set) {
        this.remove(set)
      } else {
        if (!this.deal(Math.max(12 - this.length, 3))) {
          // there weren't any cards left in the deck.
          // If there are cards left on the board, and we've changed
          // since the last time we printed, print again, with no matching
          // sets
          if ((this.cards.length > 0) &&
              (this.history[this.history.length - 1]).sets.length > 0) {
            this.history.push(new Board(this.cards))
          }
          break
        }
      }
    }
  }
  deal (num = 3) {
    const cards = this.deck.deal(num)
    if (cards.length > 0) {
      this.cards = [...this.cards, ...cards]
      this.history.push(new Board(this.cards))
      return this.cards
    }
    return null
  }
  remove (cards) {
    if (!Array.isArray(cards)) {
      cards = [cards]
    }
    cards.forEach((c) => {
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
    const set = it.next()
    if (set) {
      this.history[this.history.length - 1].sets.push(new Set(set))
    }
    return set
  }
  get length () {
    return this.cards.length
  }
}
exports.Hand = Hand
