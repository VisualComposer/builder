let join = require('path').join
let fs = require('fs')
let uf = require('util').format
let config = require('./settings')

let Collector = {
  directory: '',
  buildFile () {
    let content = Collector.getVariables()
    Collector.writeToFile(content)
  },
  getVariables () {
    let defaultPath = join(config.publicDir, 'default-variables.js')
    let isDefaultVariablesExists = fs.existsSync(defaultPath)

    let customPath = join(config.publicDir, 'custom-variables.js')
    let isCustomVariablesExists = fs.existsSync(customPath)

    let content = []
    let relativePath
    if (isDefaultVariablesExists) {
      relativePath = join('..', 'default-variables.js').replace(/\\/g, '/')
      content.push(
        `import '${relativePath}'`
      )
    }
    if (isCustomVariablesExists) {
      relativePath = join('..', 'custom-variables.js').replace(/\\/g, '/')
      content.push(
        `import '${relativePath}'`
      )
    }
    return content.join(`\n`)
  },
  writeToFile (content) {
    fs.writeFileSync(join(config.publicDir, config.configPath, 'variables.js'), `${content}\n`)
  }
}

module.exports = Collector
