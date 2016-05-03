/**
 * Created by Vasilij on 28.04.2016.
 */
var swig = require('swig');
var path = require('path');
var fs = require('fs');
var babel = require('babel-core');
var handlebars = require('handlebars');

var args = process.argv.slice(2);
var elementPath = args[0];
var elementDir = false;

if (!elementPath || !(elementDir = path.join(process.cwd(), elementPath))) {
    console.log('Wrong element path');
    process.exit(1);
}

fs.lstat(elementDir, function(err, stats) {

    // Get template file
    var templateFile = path.join(elementDir, '/template.tpl');
    var template = fs.existsSync(templateFile) ? fs.readFileSync(templateFile) : '';

    if(!template) {
        console.log('Template file is empty');
        process.exit(1);
    }

    // Create css config
    var cssTemplateSrc = [];
    var regexp = /class=\s*"([^"]+)"/gmi;
    var match = regexp.exec(template);
    while (null !== match) {
        cssTemplateSrc = cssTemplateSrc.concat(match[1]);
        match = regexp.exec(template);
    }
    cssTemplateSrc = cssTemplateSrc.join(' ');
    var cssTemplate = handlebars.compile(cssTemplateSrc);

    var scriptsFile = path.join(elementDir, 'scripts.js');
    var scriptsData = require(scriptsFile);

    // get css classes for config
    var result = cssTemplate(scriptsData);
    var classes = result.split(' ');

    // parse classes and prepare values
    var slicerData = {};
    regexp = /^(.*?){{([^}]+)}}/i;
    match = null;
    classes.forEach(function(el) {
        match = el.match(regexp);
        if (match) {
            if(!slicerData.hasOwnProperty(match[2])){
                slicerData[match[2]] = {
                    "prefix": match[1],
                    "values": []
                };
            }
        }
    });

    for(var prop in scriptsData.exports) {
        if (slicerData.hasOwnProperty(prop) && scriptsData.exports[prop].hasOwnProperty('options')) {
            var result = scriptsData.exports[prop].options.map(function (opt) {
                return opt.value;
            });
            slicerData[prop].values = result;
        }
    }
    slicerData = JSON.stringify(slicerData);



    if (!err && stats.isDirectory()) {
        fs.writeFileSync(path.join(elementDir, 'css-settings.json'), slicerData);
    } else {
        console.log('Directory "'+elementDir+'" does not exist!');
        process.exit(1);
    }
});
