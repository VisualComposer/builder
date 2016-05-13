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
    if (!settings.name.value) {
      console.log('Error, wrong name in settings');
      process.exit(1);
    }
    // create vars from settings
    var varNames = [];
    var varData = {};
    for (let variable in settings) {
      if (settings[variable].hasOwnProperty('value') && 'public' === settings[variable].access) {
        varNames.push(variable);
        varData[variable] = settings[variable].value;
      }
    }
    var varString = varNames.join(', ');
    var variables = 'var {' + varString + (varString.length ? ', ' : '') + 'id, content, ...other} = this.props;';
    // prepare template scripts
    var javascriptFile = path.resolve(elementDir, 'scripts.js');
    var javascriptString = fs.existsSync(javascriptFile) ? fs.readFileSync(javascriptFile) : '';
    if (!javascriptString && javascriptString.length) {
      console.log('Error, wrong scripts.js file.');
      process.exit(1);
    }
    // JSX Component
    var templateFile = path.resolve(elementDir, 'Template.jsx');
    var templateString = fs.existsSync(templateFile) ? fs.readFileSync(templateFile) : '';
    if (!templateString && templateString.length) {
      console.log('Error, wrong Template.jsx file.');
      process.exit(1);
    }
    if ((templateString + '').match(/data\-vcv\-dropzone/)) {
      settings.type = {
        access: 'protected',
        type: 'string',
        value: 'container'
      };
    }
    // Css settings
    //file
    var cssFile = path.resolve(elementDir + '/css', settings.tag.value + '.css');
    var cssExists = fs.existsSync(cssFile);
    if (!cssExists) {
      console.log('Error, css file should be provided');
      process.exit(1);
    }
    cssFile = "require( './css/" + settings.tag.value + ".css' );";
    // Settings
    var cssSettingsFile = path.resolve(elementDir, 'css.json');
    var cssSettingsString = fs.existsSync(cssSettingsFile) ? fs.readFileSync(cssSettingsFile) : '{}';
    var cssSettings = JSON.parse(cssSettingsString);
    if (!cssSettings) {
      console.log('Error, wrong css settings');
      process.exit(1);
    }
    var template = swig.renderFile(path.join(__dirname, 'template.js.tpl'), {
      settings: function() {
        return JSON.stringify(settings);
      },
      variables: function() {
        return variables;
      },
      templateJs: function() {
        return javascriptString;
      },
      template: function() {
        return templateString;
      },
      jsCallback: function() {
        return 'function(){}';
      },
      cssFile: function() {
        return cssFile + '';
      },
      cssSettings: function() {
        return cssSettingsString + '';
      },
      editorJsSettings: function() {
        return 'null';
      }
    });
    fs.writeFileSync(path.join(elementDir, settings.tag.value + '.js'), template);
  } else {
    console.log('Directory "${elementDir}" does not exist!');
    process.exit(1);
  }
});
