var swig = require('swig');
var path = require('path');
var fs = require('fs');
var babel = require('babel-core');

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
    var settingsString = fs.existsSync(settingsFile) ? fs.readFileSync(settingsFile) : '{}';
    var settings = JSON.parse(settingsString);
    if(!settings.tag || !settings.tag.value) {
      console.log('Error, wrong tag in settings');
      process.exit(1);
    }
    if(!settings.name.value) {
      console.log('Error, wrong name in settings');
      process.exit(1);
    }
    // JSX Component
    var componentFile = path.resolve(elementDir, 'Template.jsx');
    var componentString = fs.existsSync(componentFile) ?  fs.readFileSync(componentFile) : '';
    if(!componentString && componentString.length) {
      console.log('Error, wrong Template.jsx file.');
      process.exit(1);
    }
    // Css settings
    // Settings
    var cssSettingsFile = path.resolve(elementDir, 'css.json');
    var cssSettingsString = fs.existsSync(cssSettingsFile) ? fs.readFileSync(cssSettingsFile) : '{}';
    var cssSettings = JSON.parse(cssSettingsString);
    if(!cssSettings) {
      console.log('Error, wrong css settings');
      process.exit(1);
    }
    var template = swig.renderFile(path.join(__dirname, 'template.js.tpl'), {
      settings: function() {return settingsString + ''},
      Component: function() {return 'function() {' + componentString + '}';},
      jsCallback: function() {return 'function(){}';},
      cssSettings: function() {return cssSettingsString + ''; },
      editorJsSettings: function() {return "null";}
    });
    //
    fs.writeFileSync(path.join(elementDir, settings.tag.value + '.js'), template);
    /*new compressor.minify({
      type: 'uglifyjs',
      fileIn: path.join(elementDir, settings.tag.value + '.js'),
      fileOut:path.join(elementDir, settings.tag.value + '.min.js'),
      callback: function(err, min){
        console.log(err);
        //console.log(min);
      }
    });*/
  } else {
    console.log('Directory "${elementDir}" does not exist!');
    process.exit(1);
  }
});