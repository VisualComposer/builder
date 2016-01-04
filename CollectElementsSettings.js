var path = require('path');
var fs = require('fs');
var Builder = {
    elementsDirectory: '',
    buildFile: function () {
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
    writeToFile: function (content) {
        fs.writeFileSync(path.join(this.elementsDirectory, 'ElementsSettings.js'), content);
    }
}
Builder.elementsDirectory = path.join(__dirname, 'public/sources/elements');

var CollectElementSettings = function (options) {
};

CollectElementSettings.prototype.apply = function (compiler) {
    console.log('Collect elements settings');
    compiler.plugin('run', function (params) {
        Builder.buildFile();
    });
}

module.exports = CollectElementSettings;