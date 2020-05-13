"use strict"

const path = require('path')
const util = require('util')
const pug = require('pug')

class Formatted {
  static compiled = {}

  template (outputType) {
    const nm = path.join(
      __dirname,
      'templates',
      `${this.constructor.name.toLowerCase()}-${outputType}.pug`)
    let js = Formatted.compiled[nm]
    if (!js) {
      js = pug.compileFile(nm, {pretty: true})
      Formatted.compiled[nm] = js
    }
    return js({obj: this})
  }

  html () {
    return this.template('html')
  }

  text () {
    return this.template('text')
  }

  inspect () {
    return this.template('text')
  }

  [util.inspect.custom] () {
    return this.inspect()
  }
}

module.exports = Formatted
