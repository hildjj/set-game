"use strict"

const path = require('path')
const util = require('util')
const pug = require('pug')

/**
 * A Formatted class uses one or more Pug templates to translate into
 * different formats.
 */
class Formatted {
  // cache
  static #compiled = {}

  /**
   * The directory to find Pug template files in
   * @static
   */
  static TEMPLATE_DIR = path.join(__dirname, '..', 'templates')

  /**
   * Reset the cache
   * @static
   */
  static reset () {
    Formatted.#compiled = {}
  }

  /**
   * Execute a template of the give output type
   *
   * @param {string} outputType - e.g. "text" or "html"
   * @param {object} [opts={}] - util.inspect options, or anything else you want
   * @returns {string} The rendered template
   */
  template (outputType, opts={}) {
    const key = `${this.constructor.name.toLowerCase()}-${outputType}`
    let js = Formatted.#compiled[key]
    if (!js) {
      const nm = path.join(Formatted.TEMPLATE_DIR, `${key}.pug`)
      js = pug.compileFile(nm, {pretty: true})
      Formatted.#compiled[key] = js
    }
    return js({obj: this, opts})
  }

  /**
   * Render the HTML template for this object
   *
   * @param {object} [opts={}] - util.inspect options, or anything else you want
   * @returns {string} The rendered template
   */
  html (opts) {
    return this.template('html', opts)
  }

  /**
   * Render the text template for this object
   *
   * @param {object} [opts={}] - util.inspect options, or anything else you want
   * @returns {string} The rendered template
   */
  text (opts) {
    return this.template('text', opts)
  }

  /**
   * Use the text template for visualizing the object in the node REPL
   *
   * @param {number} depth - depth to descend
   * @param {object} opts - see util.inspect for options
   * @returns
   */
  [util.inspect.custom] (depth, opts) {
    return this.text(opts)
  }
}

module.exports = Formatted
