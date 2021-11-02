let path = require('path')
let fs = require('fs')
let uf = require('util').format
let config = require('./settings')

let ServicesCollector = {
  directory: '',
  buildFile: function (prefix, services) {
    let content = "let join = require('path').join\n"
    services.forEach(function (f) {
      let modulePath = path.join(config.publicDir, config.modulePath, f)
      if (fs.existsSync(modulePath + '/module.js')) {
        content += uf("require('../%s/%s/module.js')\n", config.modulePath, f)
      } else if (fs.existsSync(modulePath + '/module.ts')) {
        content += uf("require('../%s/%s/module.ts')\n", config.modulePath, f)
      } else {
        console.error('Module: ' + f + ' doesnt exists in: ' + modulePath)
      }
    })
    this.writeToFile(prefix, content)
  },
  writeToFile: function (prefix, content) {
    fs.writeFileSync(path.join(config.publicDir, config.configPath, uf('%s-modules.js', prefix)), content)
  }
}

module.exports = ServicesCollector
