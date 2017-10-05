#! /usr/bin/env node

const parseArgs = require('minimist')
const Preferences = require('preferences')
const readlineSync = require('readline-sync')

const update = require('./modules/update')

let prefs = new Preferences('vc-cli')

function CLI () {
  checkGitlabPrivateToken()
  console.log('cli break')
  executeCommandLine()
}

// On every command, check if CLI user has his Gitlab private token stored.
function checkGitlabPrivateToken () {
  if (!prefs.gitlab || !prefs.gitlab.privateToken) {
    let answer = readlineSync.question('Enter your gitlab private token: \n')
    prefs.gitlab = {
      privateToken: answer
    }
  }
}

function executeCommandLine () {
  console.log('exec')
  let cliArguments = parseArgs(process.argv.slice(2))
  if (cliArguments._.indexOf('update') > -1) {
    console.log('update')
    update()
  }
}

CLI()
