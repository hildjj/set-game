"use strict"

const path = require('path')
const util = require('util')
const pug = require('pug')

class Formatted {
  static compiled = {}

  template (outputType, opts={}) {
    const nm = path.join(
      __dirname,
      '..',
      'templates',
      `${this.constructor.name.toLowerCase()}-${outputType}.pug`)
    let js = Formatted.compiled[nm]
    if (!js) {
      js = pug.compileFile(nm, {pretty: true})
      Formatted.compiled[nm] = js
    }
    return js({obj: this, opts})
  }

  html (opts) {
    return this.template('html', opts)
  }

  text (opts) {
    return this.template('text', opts)
  }

  [util.inspect.custom] (depth, opts) {
    return this.text(opts)
  }
}

module.exports = Formatted
