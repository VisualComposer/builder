var join = require('path').join
var fs = require('fs')
var uf = require('util').format
var config = require('./settings')

var Collector = {
  directory: '',
  buildFile (prefix) {
    var content = Collector.getAttributes()
    Collector.writeToFile(prefix, content)
  },
  getAttributes () {
    var path = join(config.publicDir, config.attributePath)
    var files = fs.readdirSync(path)
    var content = "" +
      "import {getService} from 'vc-cake'\n" +
      "const attributeService = getService('cook').attributes\n" + "\n"
    files.forEach((attribute)=> {
      var filePath = join(path, attribute)
      var stats = fs.lstatSync(filePath)
      var isDirectory = stats.isDirectory()
      if (isDirectory && attribute[ 0 ] !== '_') {
        var componentPath = join(filePath, 'Component.js')
        var isComponentExists = fs.existsSync(componentPath)
        var getterPath = join(filePath, 'Getter.js')
        var isGetterExists = fs.existsSync(getterPath)
        var setterPath = join(filePath, 'Setter.js')
        var isSetterExists = fs.existsSync(setterPath)
        var attributeRelativePath = join('..', config.attributePath, attribute)
        if (isComponentExists) {
          content += uf("import {default as %sComponent} from '%s'\n", attribute, join(attributeRelativePath, 'Component').replace(/\\/g, '/'))
        }
        if (isGetterExists) {
          content += uf("import {default as %sGetter} from '%s'\n", attribute, join(attributeRelativePath, 'Getter').replace(/\\/g, '/'))
        }
        if (isSetterExists) {
          content += uf("import {default as %sSetter} from '%s'\n", attribute, join(attributeRelativePath, 'Setter').replace(/\\/g, '/'))
        }
        let representersDirPath = join(filePath, 'representers')
        let representers = {}
        let representersDirStats = fs.existsSync(representersDirPath) ? fs.lstatSync(representersDirPath) : false
        if (representersDirStats) {
          let files = fs.readdirSync(representersDirPath)
          files.forEach((file) => {
            let filePath = join(representersDirPath, file)
            let stats = fs.lstatSync(filePath)
            if (file[0] !== '_' && stats.isFile()) {
              const representerContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, {encoding: 'utf8'}) : false
              if (representerContent) {
                const componentName = representerContent.match(/(?:export.+class\s*)([^\s]+)/)
                if (componentName) {
                  let attributeName = attribute.charAt(0).toUpperCase() + attribute.slice(1)
                  let className = `Representer${componentName[1]}For${attributeName}`
                  representers[componentName[1]] = className
                  content += uf("import {default as %s} from '%s'\n", className, join(attributeRelativePath, 'representers', file).replace(/\\/g, '/'))
                }
              }
            }
          })
        }
        if (isComponentExists) {
          content += uf("attributeService.add('%s', %sComponent, {\n", attribute, attribute)
        } else {
          content += uf("attributeService.add('%s', null, {\n", attribute)
        }
        var gettersSetters = []
        if (isGetterExists) {
          gettersSetters.push(uf("getter: %sGetter", attribute))
        }
        if (isSetterExists) {
          gettersSetters.push(uf("setter: %sSetter", attribute))
        }
        content += gettersSetters.join(',')
        if (Object.keys(representers).length) {
          content += uf("},{\n")
          const list = Object.keys(representers).map((name) => {
            return uf(`${name}: ${representers[name]}`)
          })
          content += list.join(",\n")
        }
        content += uf("})\n")
      }
    })
    return content
  },
  writeToFile(prefix, content) {
    fs.writeFileSync(join(config.publicDir, config.configPath, uf('%s-attributes.js', prefix)), content)
  }
}

module.exports = Collector
