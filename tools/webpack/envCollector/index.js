import {join} from 'path'
import fs from 'fs'
import config from '../settings'

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

let EnvCollector = () => {}

EnvCollector.prototype.apply = function (compiler) {
  compiler.plugin('run', function (params, callback) {
    console.log('Collect env variables')
    Collector.buildFile()
    callback()
  })
}
module.exports = EnvCollector
