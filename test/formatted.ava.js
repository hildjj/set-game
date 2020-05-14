'use strict'

const util = require('util')
const test = require('ava')
const Formatted = require('../lib/formatted')

test.before(t => {
  t.context.TEMPLATE_DIR = Formatted.TEMPLATE_DIR
  Formatted.TEMPLATE_DIR = __dirname
})

test.after.always(t => {
  Formatted.TEMPLATE_DIR = t.context.TEMPLATE_DIR
})

test('create', t => {
  const f = new Formatted()
  t.is(f.html(), '\n<div class="formatted"></div>')
  t.is(f.text(), 'Formatted')
  t.is(f.text(), 'Formatted') // check the cache
  Formatted.reset()
  t.is(util.inspect(f), 'Formatted')
})
