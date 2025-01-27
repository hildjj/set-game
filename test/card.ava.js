import {Card, Deck, Hand} from '../lib/index.js';
import {stripVTControlCharacters} from 'node:util';
import test from 'ava';

test('Card', t => {
  const c1 = new Card(1, 'Hatched', 'green', 'Squiggle');
  t.is(c1.num, 1);
  t.is(c1.color, 'green');
  t.is(c1.fill, 'Hatched');
  t.is(c1.shape, 'Squiggle');
  const d = new Card(2, 'Hatched', 'purple', 'Diamond');
  const e = new Card(3, 'Hatched', 'R', 'Pill');
  const f = new Card(3, 'Hatched', 'red', 'd');
  const g = new Card(3, 'h', 'g', 'p');
  const h = new Card('3sgp');
  t.true(c1.isSet(d, e));
  t.false(c1.isSet(d, f));
  t.is(Card.compare(c1, d), -1);
  t.is(Card.compare(c1, c1), 0);
  t.is(Card.compare(d, c1), 1);
  t.is(Card.compare(e, f), 1);
  t.is(Card.compare(f, e), -1);
  t.is(Card.compare(f, g), 1);
  t.is(Card.compare(g, f), -1);
  t.is(Card.compare(h, g), 1);
  t.is(Card.compare(g, h), -1);

  const c2 = new Card('2hgs');
  t.is(c2.num, 2);
  t.is(c2.color, 'green');
  t.is(c2.fill, 'Hatched');
  t.is(c2.shape, 'Squiggle');

  t.is(c2.text({colors: false}), '2HgS ');
  t.is(stripVTControlCharacters(c2.text({colors: true})), '~~ /   ');
  t.is(c2.text(), '2HgS ');
  t.is(c2.name(), '2HgS');
});

test('bad cards', t => {
  t.throws(() => new Card(4));
  t.throws(() => new Card(-1));
  t.throws(() => new Card(1, 'hexed', 'blue', 'whale'));
  t.throws(() => new Card(1, 'hatched', 'blue', 'whale'));
  t.throws(() => new Card(1, 'HATCHED', 'PURPLE', 'whale'));
});

test('Deck', t => {
  const d = new Deck();
  t.is(d.cards.length, 81);
  const ordered = [...d.cards];
  d.shuffle();
  t.is(d.cards.length, 81);
  t.notDeepEqual(d.cards, ordered); // This test will fail one in 2^^81 times
  const cards = d.deal(3);
  t.is(cards.length, 3);
});

test('Hand', t => {
  const h = new Hand();
  t.is(h.length, 0);
  h.play();
  t.truthy(h.history.length > 0);
  h.cards = [];
  t.falsy(h.firstSet());
});

test('Hand remove', t => {
  const h = new Hand();
  h.deal();
  const [card] = h.cards;
  h.remove(card);
  t.throws(() => h.remove(card));
  t.is(h.length, 2);
  h.remove(h.cards.slice(0, 1));
  t.is(h.length, 1);
});

test('leftover', t => {
  // Some cards left over at the end that have no sets
  const board = `\
3HpD 3HrP 1HgP
2SrS 2SgP 1SpP`.split(/\s+/gm).map(n => new Card(n));
  const h = new Hand();
  h.deck.cards = [];
  h.add(board);
  t.is(h.combinations().length, 20n);
  h.play();
  t.is(h.length, board.length);
});
