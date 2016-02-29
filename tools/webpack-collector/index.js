var SettingsCollector = require('./lib/settings-collector');
var ServicesCollector = require('./lib/services-collector');
var ModulesCollector = require('./lib/modules-collector');
var Collector = function() {};
Collector.prototype.apply = function(compiler) {
  compiler.plugin('run', function(params) {
    console.log('Collect elements settings');
    SettingsCollector.buildFile();
    console.log('Collect services');
    Object.keys(params.options.vc).forEach(function(prefix){
      console.log('Build data for ' + prefix);
        var settings = params.options.vc[prefix];
        if(settings.services) {
          ServicesCollector.buildFile(prefix, settings.services);
        }
        if(settings.modules) {
          ModulesCollector.buildFile(prefix, settings.modules);
        }
    });
  });
};

module.exports = Collector;