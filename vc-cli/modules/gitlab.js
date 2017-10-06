const readlineSync = require('readline-sync')

// On every command, check if CLI user has his Gitlab private token stored.
function checkGitlabPrivateToken (prefs) {
  if (!prefs.gitlab || !prefs.gitlab.privateToken) {
    console.log('No gitlab private token found!')
    let answer = readlineSync.question('Enter your gitlab private token: \n')
    prefs.gitlab = {
      privateToken: answer
    }
    console.log('Gitlab private token saved. To change it, use \'vc token\' command.')
  }
}

function changeGitlabPrivateToken (prefs) {
  let answer = readlineSync.question('Enter your new gitlab private token: \n')
  prefs.gitlab.privateToken = answer
  console.log('New gitlab private token saved.')
}

module.exports = {
  checkGitlabPrivateToken,
  changeGitlabPrivateToken
}
