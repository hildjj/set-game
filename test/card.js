'use strict'
const test = require('ava')
const {Card, Deck} = require('../card')

test('Card', t => {
  const c = new Card(1, 'green', 'Striped', 'Squiggle')
  t.is(c.num, 1)
  t.is(c.color, 'green')
  t.is(c.fill, 'Striped')
  t.is(c.shape, 'Squiggle')
  const d = new Card(2, 'purple', 'Striped', 'Diamond')
  const e = new Card(3, 'red', 'Striped', 'Pill')
  const f = new Card(3, 'red', 'Striped', 'Diamond')
  t.true(c.isSet(d, e))
  t.false(c.isSet(d, f))
})

test('Deck', t => {
  const d = new Deck()
  t.is(d.cards.length, 81)
})
