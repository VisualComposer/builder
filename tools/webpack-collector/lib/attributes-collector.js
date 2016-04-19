var path = require('path');
var fs = require('fs');
var uf = require('util').format;
var config = require('./settings');

var Collector = {
  directory: '',
  buildFile: function(prefix, attributes) {
    var content = "var join = require('path').join;\n";
    attributes.forEach(function(f) {
      content += uf("require('../%s/%s/attribute.js');\n", config.attributePath, f);
    });
    this.writeToFile(prefix, content);
  },
  writeToFile: function(prefix, content) {
    fs.writeFileSync(path.join(config.publicDir, config.configPath, uf('%s-attributes.js', prefix)), content);
  }
};

module.exports = Collector;
