'use strict';
const test = require('ava');
const {Card, Deck} = require('../card');

test("Card", t => {
  const c = new Card(1, 'Green', 'Striped', 'Squiggle');
  t.is(c.num, 1);
  t.is(c.color.toString(), 'Symbol(Green)');
  t.is(c.fill.toString(), 'Symbol(Striped)');
  t.is(c.shape.toString(), 'Symbol(Squiggle)');
  const d = new Card(2, 'Purple', 'Striped', 'Diamond');
  const e = new Card(3, 'Orange', 'Striped', 'Pill');
  const f = new Card(3, 'Orange', 'Striped', 'Diamond');
  t.true(c.isSet(d, e));
  t.false(c.isSet(d,f))
});

test("Deck", t => {
  const d = new Deck();
  t.is(d.cards.length, 81);
});