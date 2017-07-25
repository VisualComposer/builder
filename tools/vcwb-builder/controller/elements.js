/* global process, console */
const fs = require('fs-extra')
const path = require('path')
const ElementsBuilder = require('../lib/elementsBuilder')
/**
 * Build elements budle
 */
exports.build = (dir, repo, accountRepo, elements = {}, commit, version, settings) => {
  dir = path.resolve(dir || process.cwd())
  if (!fs.lstatSync(dir).isDirectory()) {
    console.log("Can't create bundle. Wrong working directory.")
  }
  const b = new ElementsBuilder(dir, repo, accountRepo, settings)
  b.build(elements, commit, version || 'dev', () => {
    console.log('Elements bundle zip archive created!')
  })
}
