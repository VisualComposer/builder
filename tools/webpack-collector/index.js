var ServicesCollector = require('./lib/services-collector')
var ModulesCollector = require('./lib/modules-collector')
var AttributesCollector = require('./lib/attributes-collector')
var ElementsCollector = require('./lib/elements-collector')
var EnvCollector = require('./lib/env-collector')
let exec = require('child_process').exec
var Collector = function () {
}
Collector.prototype.apply = function (compiler) {
  compiler.plugin('run', function (params, callback) {
    console.log('Collect elements')
    console.log('Build elements css')
    exec('npm run-script collect-css')
    console.log('Collect services/modules/attributes')
    Object.keys(this.options.vc).forEach(function (prefix) {
      console.log('Build data for ' + prefix)
      var settings = this.options.vc[ prefix ]
      if (settings.services) {
        ServicesCollector.buildFile(prefix, settings.services)
      }
      if (settings.modules) {
        ModulesCollector.buildFile(prefix, settings.modules)
      }
      AttributesCollector.buildFile(prefix)
    }.bind(this))
    ElementsCollector.buildFile()
    EnvCollector.buildFile()
    callback()
  })
}

module.exports = Collector
