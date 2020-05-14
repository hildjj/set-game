'use strict'
const test = require('ava')
const { Card, Deck } = require('../lib/index')

test('Card', t => {
  const c = new Card(1, 'Striped', 'green', 'Squiggle')
  t.is(c.num, 1)
  t.is(c.color, 'green')
  t.is(c.fill, 'Striped')
  t.is(c.shape, 'Squiggle')
  const d = new Card(2, 'Striped', 'purple', 'Diamond')
  const e = new Card(3, 'Striped', 'red', 'Pill')
  const f = new Card(3, 'Striped', 'red', 'Diamond')
  t.true(c.isSet(d, e))
  t.false(c.isSet(d, f))
})

test('Deck', t => {
  const d = new Deck()
  t.is(d.cards.length, 81)
})
