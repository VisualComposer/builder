var path = require('path');
var fs = require('fs');
var uf = require('util').format;

var SettingsBuilder = {
  elementsDirectory: '',
  buildFile: function() {
    var files = fs.readdirSync(this.elementsDirectory);
    var content = 'module.exports = [' + "\n";
    for (var i in files) {
      var settingsPath = path.join(this.elementsDirectory, files[i], 'settings.json');
      var fileContent = fs.existsSync(settingsPath) ? fs.readFileSync(settingsPath, 'utf8') : false;
      if (fileContent) {
        content += fileContent + ',';
      }
    }
    this.writeToFile(content.replace(/,$/, '];'));
  },
  writeToFile: function(content) {
    fs.writeFileSync(path.join(this.elementsDirectory, 'ElementsSettings.js'), content);
  }
}
SettingsBuilder.elementsDirectory = path.join(__dirname, 'public/sources/elements');

var ServicesBuilder = {
  directory: '',
  buildFile: function() {
    var files = fs.readdirSync(this.directory);
    var content = "var loader = require('./lib/vc-loader');\n";
    files.forEach(function(f) {
      content += uf("loader.loadService('%s');\n", f);
    });
    this.writeToFile(content);
  },
  writeToFile: function(content) {
    fs.writeFileSync(path.join(__dirname, 'public/services.js'), content);
  }
};
ServicesBuilder.directory = path.join(__dirname, 'public/editor/services');

var Collector = function(options) {
};

Collector.prototype.apply = function(compiler) {
  compiler.plugin('run', function(params) {
    console.log('Collect elements settings');
    SettingsBuilder.buildFile();
    console.log('Collect services');
    ServicesBuilder.buildFile();
  });
}

module.exports = Collector;