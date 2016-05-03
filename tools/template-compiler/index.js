/**
 * Created by Vasilij on 03.05.2016.
 */
var swig = require('swig');
var path = require('path');
var fs = require('fs');

var args = process.argv.slice(2);
var elementPath = args[0];
var elementDir = false;

if (!elementPath || !(elementDir = path.resolve(process.cwd(), elementPath))) {
  console.log('Wrong element path');
  process.exit(1);
}

fs.lstat(elementDir, function(err, stats) {
  if (!err && stats.isDirectory()) {
    // Settings
    var settingsFile = path.resolve(elementDir, 'settings.json');
    var settingsString = fs.existsSync(settingsFile) ? fs.readFileSync(settingsFile) : '{}';
    var settings = JSON.parse(settingsString);
    if (!settings.tag || !settings.tag.value) {
      console.log('Error, wrong tag in settings');
      process.exit(1);
    }

    // create vars from settings
    var varNames = [];
    var varData = {};
    for (let variable in settings) {
      if (settings[variable].hasOwnProperty('value')) {
        varNames.push(variable);
        varData[variable] = settings[variable].value;
      }
    }
    var variables = 'var {' + varNames.join(', ') + ', ...other} = this.props;';

    // prepare template scripts
    var javascriptFile = path.resolve(elementDir, 'template.js');
    var javascriptString = fs.existsSync(javascriptFile) ? fs.readFileSync(javascriptFile) : '';
    if (!javascriptString && javascriptString.length) {
      console.log('Error, wrong javascript.js file.');
      process.exit(1);
    }

    // prepare JSX template
    var templateFile = path.resolve(elementDir, 'Template.jsx');
    var templateString = fs.existsSync(templateFile) ? fs.readFileSync(templateFile) : '';
    if (!templateString && templateString.length) {
      console.log('Error, wrong Template.jsx file.');
      process.exit(1);
    }

    // parse template
    var template = swig.renderFile(path.join(__dirname, 'template.js.tpl'), {
      settings: function() {
        return variables;
      },
      templateJs: function() {
        return javascriptString;
      },
      template: function() {
        return templateString;
      }
    });
    // create compiled template file
    fs.writeFileSync(path.join(elementDir, settings.tag.value + '.js'), template);
  } else {
    console.log('Directory "' + elementDir + '" does not exist!');
    process.exit(1);
  }
});
