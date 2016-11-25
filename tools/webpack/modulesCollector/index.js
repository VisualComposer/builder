import {join} from 'path'
import fs from 'fs'
import {format as uf} from 'util'
import config from '../settings'
import options from '../bootstrap'

let Collector = {
  directory: '',
  buildFile (prefix, modules) {
    let content = ''
    modules.forEach((f) => {
      content += uf("import '../%s/%s/module'\n", config.modulePath, f)
    })
    this.writeToFile(prefix, content)
  },
  writeToFile (prefix, content) {
    fs.writeFileSync(join(config.publicDir, config.configPath, uf('%s-modules.js', prefix)), content)
  }
}

let ModulesCollector = () => {}

ModulesCollector.prototype.apply = function (compiler) {
  compiler.plugin('run', function (params, callback) {
    console.log('Collect modules')
    Object.keys(options.vc).forEach((prefix) => {
      const data = options.vc[ prefix ]
      if (data.modules) {
        Collector.buildFile(prefix, data.modules)
      }
    })
    callback()
  })
}
module.exports = ModulesCollector
