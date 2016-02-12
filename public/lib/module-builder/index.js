var swig = require('swig');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var moduleDir = '../../editor/modules';


var args = process.argv.slice(2);
var module = args[0];

if (!module || module.match(/\d[a-z]\-/)) {
  conole.log('Wrong module name should be letter with dashes. module path based on dashes');
  process.exit(1);
}
var modulePath = module.split('-');
if(modulePath.length < 2 || modulePath[1].length == 0) {
  console.log('Module should be inside directory. Existing directories: ui,content.');
  process.exit(1);
}
var directory = path.join(__dirname, moduleDir, ...modulePath);
mkdirp(directory, function(err) {
  if (err) {
    return console.error(err);
  }
  var template = swig.renderFile(path.join(__dirname, '_template.js'), {
    module: module
  });
  fs.mkdir(path.join(directory, 'lib'), function(err) {
    if (err) {
      return console.error(err);
    }
  });
  fs.mkdir(path.join(directory, 'css'), function(err) {
    fs.writeFileSync(path.join(directory, 'css', 'module.less'), '');
  });
  fs.writeFileSync(path.join(directory, 'module.js'), template);
});