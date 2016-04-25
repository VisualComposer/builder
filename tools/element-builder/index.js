var swig = require('swig');
var path = require('path');
var fs = require('fs');

var args = process.argv.slice(2);
var elementPath = args[0];
var elementDir = false;
if (!elementPath || !(elementDir = path.resolve(process.cwd(), elementPath))
) {
  console.log('Wrong element path');
  process.exit(1);
}
fs.lstat(elementDir, function(err, stats) {
  if (!err && stats.isDirectory()) {
    // Settings
    var settingsFile = path.resolve(elementDir, 'settings.json');
    var settingsString = fs.existsSync(settingsFile) ? fs.readFileSync(settingsFile) : false;
    var settings = JSON.parse(settingsString);
    if(!settings.tag || !settings.tag.value) {
      console.log('Error, wrong tag in settings');
      process.exit(1);
    }
    if(!settings.name.value) {
      console.log('Error, wrong name in settings');
      process.exit(1);
    }
    var template = swig.renderFile(path.join(__dirname, 'template.js.tpl'), {
      settings: function() {return settingsString + ''},
      Component: function() {return 'function(){}';},
      jsSettings: function() {return 'function(){}';},
      cssSettings: function() {return '{}'; },
      editorSettings: function() {return "null";}
    });
    console.log(template);
    // fs.writeFileSync(path.join(path.basename(elementDir), settings.tag.value + '.js'), template);
  } else {
    console.log('Directory "' + elementDir + '" does not exist!');
    process.exit(1);
  }
});