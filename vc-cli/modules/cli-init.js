const fs = require('fs')
const shell = require('shelljs')
const os = require('os')

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

function set (prefs) {
  let result = {}
  let initFile = checkInitFile()
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
  }
}

function get () {
  let initFile = checkInitFile()
  if (initFile) {
    let data = fs.readFileSync(cliJson, 'utf8')
    return JSON.parse(data)
  } else {
    console.log('Missing vc-cli.json!')
  }
}

module.exports = {
  set,
  get,
  setUpdateDate
}
