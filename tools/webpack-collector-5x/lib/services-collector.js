let path = require('path');
let fs = require('fs');
let uf = require('util').format;
let config = require('./settings');

let ServicesCollector = {
  directory: '',
  buildFile: function (prefix, services) {
    let content = "";
    services.forEach(function (f) {
      let servicePath = path.join(config.publicDir, config.servicePath, f)
      if (fs.existsSync(servicePath + '/service.js')) {
        content += uf("require('../%s/%s/service.js')\n", config.servicePath, f)
      } else if (fs.existsSync(servicePath + '/service.ts')) {
        content += uf("require('../%s/%s/service.ts')\n", config.servicePath, f)
      } else {
        console.error('Service: ' + f + ' doesnt exists in: ' + servicePath)
      }
    });
    this.writeToFile(prefix, content);
  },
  writeToFile: function (prefix, content) {
    fs.writeFileSync(path.join(config.publicDir, config.configPath, uf('%s-services.js', prefix)), content);
  }
};

module.exports = ServicesCollector;
