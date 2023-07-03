import {Formatted} from '../lib/formatted.js'
import {fileURLToPath} from 'url'
import path from 'path'
import test from 'ava'
import util from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  t.is(f.text(), 'Formatted') // Check the cache
  Formatted.reset()
  t.is(util.inspect(f), 'Formatted')
})
