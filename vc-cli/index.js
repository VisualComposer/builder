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

// fs.readFile(process.argv[ 2 ], 'utf8', function (err, data) {
//   console.log(data)
// })

// shell.exec('git pull', function (code, stdout, stderr) {
//   console.log('code:' + code)
//   console.log('stdout:' + stdout)
//   console.log('stderr:' + stderr)
// })
// function prompt (question, callback) {
//   var stdin = process.stdin
//   var stdout = process.stdout
//
//   stdin.resume()
//   stdout.write(question)
//
//   stdin.once('data', function (data) {
//     callback(data.toString().trim())
//   })
// }
//
// function capitalizeFirstLetter (string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }
//
// function makeCamelCase (nameArr) {
//   var result = []
//
//   nameArr.forEach(function (value, index) {
//     if (index === 0) {
//       result.push(value.toLowerCase())
//     } else {
//       result.push(capitalizeFirstLetter(value))
//     }
//   })
//
//   result = result.join('')
//   return result
// }
//
// function makeKebabCase (nameArr) {
//   var result = []
//
//   nameArr.forEach(function (value) {
//     result.push(value.toLowerCase())
//   })
//
//   result = result.join('-')
//   return result
// }
//
// function makeElNames (element) {
//   var split = element.name.split(' ')
//   element.camelCase = makeCamelCase(split)
//   element.kebabCase = makeKebabCase(split)
//   return element
// }
//
// var elementNames = {}
//
// function makeBtn (name) {
//   if (!!name.trim()) {
//     elementNames.name = name.trim()
//     elementNames = makeElNames(elementNames)
//     shell.cp('-Rf', current + '/devElements/basicButton/', current + '/devElements/' + elementNames.camelCase + '/')
//     fs.rename(current + '/devElements/' + elementNames.camelCase + '/basicButton', current + '/devElements/' + elementNames.camelCase + '/' + elementNames.camelCase + '/')
//     fs.readFile(current + '/visualcomposer/Modules/Development/DevElements.php', 'utf8', function (err, data) {
//       var devElements = data.split('\n')
//       var newFileContent = ''
//       var elementList = []
//       var currentEl = ''
//       var insideList = false
//       var pushEl = false
//       devElements.forEach(function (item, index) {
//         if (item.includes('[el list start]')) {
//           insideList = true
//         }
//         if (item.includes('[el list end]')) {
//           insideList = false
//           if (pushEl) {
//             elementList.push(currentEl)
//             currentEl = ''
//           }
//         }
//         if (item.includes('[el]') && !pushEl) {
//           pushEl = true
//         } else if (item.includes('[el]') && pushEl) {
//           elementList.push(currentEl)
//           currentEl = ''
//         }
//         if (pushEl) {
//           currentEl += item + '\n'
//         }
//       })
//       var newElement = elementList[ 4 ]
//       newElement = newElement.replace(new RegExp('basic-button', 'g'), elementNames.kebabCase)
//       newElement = newElement.replace(new RegExp('basicButton', 'g'), elementNames.camelCase)
//       newElement = newElement.replace(new RegExp('Basic Button', 'g'), elementNames.name)
//       elementList.push(newElement)
//       var result = elementList.join('')
//       // console.log(result)
//
//       insideList = false
//       pushEl = false
//       devElements.forEach(function (item) {
//         if (item.includes('[el list start]')) {
//           insideList = true
//           newFileContent += item + '\n'
//           newFileContent += result
//         }
//         if (item.includes('[el list end]')) {
//           insideList = false
//         }
//         if (!insideList) {
//           newFileContent += item + '\n'
//         }
//       })
//       // console.log(newFileContent)
//       fs.writeFile(current + '/visualcomposer/Modules/Development/DevElements.php', newFileContent, 'utf8', function (err) {
//         if (err) {
//           return console.log(err)
//         }
//       })
//     })
//   }
// }
//
// var arg = args(process.argv.slice(2))
// var current = process.cwd()
//
// if (arg._.indexOf('add') > -1 && arg._.indexOf('element') > -1 && arg.type === 'button') {
//   prompt('Enter element name: \n', function (input) {
//     makeBtn(input)
//     prompt('Enter attributes: \n', function (input) {
//       process.exit()
//     })
//   })
// }

// console.log('Arguments:', arg)
// console.log(process.cwd())
