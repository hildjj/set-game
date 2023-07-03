'use strict'

module.exports = {
  extends: ['@cto.af/eslint-config/modules', '@cto.af/eslint-config/jsdoc'],
  ignorePatterns: [
    'node_modules/',
    'docs/',
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
}
