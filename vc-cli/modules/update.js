const fs = require('fs')
const shell = require('shelljs')
const rp = require('request-promise')
const Preferences = require('preferences')

const init = require('./cli-init')

let prefs = new Preferences('vc-cli')
let initData = init()

const baseExec = () => {
  shell.exec('php ci/composer.phar update')
  shell.exec('npm run build')
  shell.exec('npm run build-settings')
}

const checkElementActivity = async () => {
  let result = []

  console.log(prefs.gitlab)
  let body = await rp(`https://gitlab.com/api/v4/groups/${initData.hubID}?private_token=${prefs.gitlab.privateToken}`)
  let res = JSON.parse(body)
  res.projects.forEach(item => {
    const lastActivity = new Date(item.last_activity_at).getTime()
    if (lastActivity > initData.lastUpdate) {
      result.push(item.name)
    }
  })
  return result
}

const checkProjectActivity = async () => {
  let result = false
  let pullChanges = shell.exec('git pull')
  if (pullChanges.stdout.includes('package.json')) {
    result = true
  }
  return result
}

const updateProject = (changes) => {
  changes && shell.exec('npm install')
  baseExec()
}

const updateAndBuildElement = (element) => {
  shell.cd(`${initData.rootDir}/devElements/${element}`)
  shell.exec('git pull')
  shell.exec(`lessc ${element}/public/src/init.less ${element}/styles.css --autoprefix="last 2 versions"`)
  shell.exec('npm run build && sed -i "" "s:../../node_modules/:./node_modules/:g" public/dist/element.bundle.js')
}

const updateElements = (changes) => {
  changes.forEach(element => {
    if (fs.existsSync(`${initData.rootDir}/devElements/${element}/`)) {
      updateAndBuildElement(element)
    } else {
      shell.cd(`${initData.rootDir}/devElements/`)
      shell.exec(`git clone git@gitlab.com:visualcomposer-hub/${element}.git`)
      updateAndBuildElement(element)
    }
  })
  shell.cd(initData.rootDir)
}

function fullUpdate () {
  shell.exec('git pull')
  console.log(3)
  shell.exec('npm install')
  console.log(4)
  baseExec()
  shell.exec('bash tools/devElements/cloneScript.sh')
  shell.exec('bash tools/devCategories/cloneScript.sh')
  if (prefs.os === 'Windows_NT') {
    shell.exec('bash tools/devElements/buildScriptWindows.sh')
  } else {
    shell.exec('bash tools/devElements/buildScriptMac.sh')
  }
  console.log('full update')
}

// Update lastUpdate date both in object and vc-cli.json
function updateLastUpdateDate () {
  let newDate = new Date().getTime()
  initData.setUpdateDate(newDate)
  initData.lastUpdate = newDate
}

module.exports = async function () {
  if (initData.lastUpdate) {
    updateProject(await checkProjectActivity())
    updateElements(await checkElementActivity())
  } else {
    console.log(2)
    fullUpdate()
  }
  updateLastUpdateDate()
}
