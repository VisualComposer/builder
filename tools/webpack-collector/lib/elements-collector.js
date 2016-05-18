var join = require('path').join
var fs = require('fs')
var uf = require('util').format
var config = require('./settings')

var Collector = {
  directory: '',
  buildFile (prefix) {
    var content = Collector.getElements()
    Collector.writeToFile(prefix, content)
  },
  getElements () {
    var path = join(config.publicDir, config.elementsPath)
    var files = fs.readdirSync(path)
    var content = '';
    files.forEach((element) => {
      var filePath = join(path, element)
      var stats = fs.lstatSync(filePath)
      var isDirectory = stats.isDirectory()
      if (isDirectory && element[ 0 ] !== '_') {
        var elementPath = join(filePath, 'element.js')
        var isElementExists = fs.existsSync(elementPath)
        if (isElementExists) {
          var elementRelativePath = join('..', config.elementsPath, element)
          content += uf("import {default as %sElement} from '%s'\n", element, join(elementRelativePath, 'element').replace(/\\/g, '/'))
        }
      }
    })
    return content
  },
  writeToFile(prefix, content) {
    fs.writeFileSync(join(config.publicDir, config.configPath, uf('%s-elements.js', prefix)), content)
  }
}

module.exports = Collector
