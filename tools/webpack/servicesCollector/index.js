import {join} from 'path'
import fs from 'fs'
import {format as uf} from 'util'
import config from '../settings'
import options from '../bootstrap'

let Collector = {
  directory: '',
  buildFile (prefix, services) {
    let content = ''
    services.forEach((f) => {
      content += uf("import '../%s/%s/service'\n", config.servicePath, f)
    })
    this.writeToFile(prefix, content)
  },
  writeToFile (prefix, content) {
    fs.writeFileSync(join(config.publicDir, config.configPath, uf('%s-services.js', prefix)), content)
  }
}

let ServicesCollector = () => {}

ServicesCollector.prototype.apply = function (compiler) {
  compiler.plugin('run', function (params, callback) {
    console.log('Collect services')
    Object.keys(options.vc).forEach((prefix) => {
      const data = options.vc[ prefix ]
      if (data.services) {
        Collector.buildFile(prefix, data.services)
      }
    })
    callback()
  })
}
module.exports = ServicesCollector
