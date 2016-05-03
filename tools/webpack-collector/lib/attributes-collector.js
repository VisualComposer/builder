var join = require('path').join;
var fs = require('fs');
var uf = require('util').format;
var config = require('./settings');

var Collector = {
  directory: '',
  buildFile(prefix) {
    var content = Collector.getAttributes();
    Collector.writeToFile(prefix, content);
  },
  getAttributes() {
    var path = join(config.publicDir, config.attributePath);
    var files = fs.readdirSync(path);
    var content = "" +
      "var getService = require('vc-cake').getService;\n" +
      "var attributeService = getService('cook').attributes;\n" +
      "\n";
    files.forEach((attribute)=> {
      var filePath = join(path, attribute);
      var stats = fs.lstatSync(filePath);
      var isDirectory = stats.isDirectory();
      if (isDirectory && attribute[0] != '_') {
        var componentPath = join(filePath, 'Component.js');
        var isComponentExists = fs.existsSync(componentPath);
        if (isComponentExists) {
          var getterPath = join(filePath, 'Getter.js');
          var isGetterExists = fs.existsSync(getterPath);
          var setterPath = join(filePath, 'Setter.js');
          var isSetterExists = fs.existsSync(setterPath);

          var attributeRelativePath = join('..', config.attributePath, attribute);
          content += uf("attributeService.add('%s', require('%s'), {\n", attribute, join(attributeRelativePath, 'Component').replace(/\\/g, '/'));
          if (isGetterExists) {
            content += uf("getter: require('%s'),\n", join(attributeRelativePath, 'Getter').replace(/\\/g, '/'));
          }
          if (isSetterExists) {
            content += uf("setter: require('%s')\n", join(attributeRelativePath, 'Setter').replace(/\\/g, '/'));
          }
          content += uf("});\n");
        }

      }
    });
    return content;
  },
  writeToFile(prefix, content) {
    fs.writeFileSync(join(config.publicDir, config.configPath, uf('%s-attributes.js', prefix)), content);
  }
};

module.exports = Collector;
