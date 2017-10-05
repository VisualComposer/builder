const fs = require('fs')
const shell = require('shelljs')
const os = require('os')
const Preferences = require('preferences')

let prefs = new Preferences('vc-cli')

const cliJson = 'vc-cli.json'

function checkInitFile () {
  return fs.existsSync(cliJson)
}

function setUpdateDate (date) {
  let data = fs.readFileSync(cliJson, 'utf8')
  data = JSON.parse(data)
  data.lastUpdate = date
  data = JSON.stringify(data)
  fs.writeFileSync(cliJson, data, 'utf8')
}

module.exports = function () {
  let initFile = checkInitFile()
  let result = {}

  if (!prefs.os) {
    prefs.os = os.type()
  }

  if (!initFile) {
    shell.touch(cliJson)

    let userData = {
      lastUpdate: null,
      rootDir: process.cwd(),
      hubID: 1529834,
      projectID: 1969729
    }

    result = JSON.stringify(userData)

    fs.writeFileSync(cliJson, result, 'utf8')
  } else {
    result = fs.readFileSync(cliJson, 'utf8')
  }

  result = JSON.parse(result)
  result.setUpdateDate = setUpdateDate
  return result
}
