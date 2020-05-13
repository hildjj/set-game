const fs = require('fs')
const pug = require('pug')
const {Deck} = require('./card')
let deck = new Deck()
deck.cards.forEach((card) => {
  const fn = `icons/${card.name()}.svg`
  fs.writeFileSync(fn, card.template('svg'))
})
