const fs = require('fs')
const pug = require('pug')
const {Deck} = require('./card')
const f = pug.compileFile('svg.pug', {
  pretty: true,
  debug: false,
  inlineRuntimeFunctions: true
})
let deck = new Deck()
deck.cards.forEach((card) => {
  const fn = `icons/${card.name()}.svg`
  fs.writeFileSync(fn, f(card))
})
