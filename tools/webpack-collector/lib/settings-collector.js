var path = require('path');
var fs = require('fs');
var config = require('./settings');
var SettingsCollector = {
  elementsDirectory: '',
  buildFile: function() {
    var files = fs.readdirSync(this.elementsDirectory);
    var content = 'module.exports = [' + '\n';
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
    fs.writeFileSync(path.join(config.publicDir, config.configPath, 'elements-settings.js'), content);
  }
};
SettingsCollector.elementsDirectory = path.join(config.publicDir, config.elementsPath);

module.exports = SettingsCollector;
