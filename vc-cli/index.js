#! /usr/bin/env node

const parseArgs = require('minimist')
const Preferences = require('preferences')
const shell = require('shelljs')

// Init vc-cli.json and local preferences file
let prefs = new Preferences('vc-cli')
const init = require('./modules/cli-init')

init.set(prefs)

// CLI command modules
const gitlab = require('./modules/gitlab')
const update = require('./modules/update')

function CLI () {
  gitlab.checkGitlabPrivateToken(prefs)
  executeCommandLine()
}

function executeCommandLine () {
  let cliArguments = parseArgs(process.argv.slice(2))

  function check (item) {
    return cliArguments._.indexOf(item) > -1
  }

  switch (true) {
    case (check('update')):
      update(prefs)
      break
    case (check('token')):
      gitlab.changeGitlabPrivateToken(prefs)
      break
    case (check('watch')):
      shell.exec(`./node_modules/.bin/concurrently --kill-others "npm run watch" "npm run watch-assets-and-elements"`)
      break
    default:
      console.log('Command not found!')
  }
}

CLI()
