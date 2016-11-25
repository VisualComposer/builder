import {join} from 'path'
import fs from 'fs'
import {format as uf} from 'util'
import config from '../settings'
import options from './../bootstrap'

let Collector = {
  directory: '',
  getAttributes () {
    let path = join(config.publicDir, config.attributePath)
    let files = fs.readdirSync(path)
    let content = `import {getService} from 'vc-cake'\nconst attributeService = getService('cook').attributes\n\n`
    files.forEach((attribute) => {
      let filePath = join(path, attribute)
      let stats = fs.lstatSync(filePath)
      let isDirectory = stats.isDirectory()
      if (isDirectory && attribute[ 0 ] !== '_') {
        let componentPath = join(filePath, 'Component.js')
        let isComponentExists = fs.existsSync(componentPath)
        let getterPath = join(filePath, 'Getter.js')
        let isGetterExists = fs.existsSync(getterPath)
        let setterPath = join(filePath, 'Setter.js')
        let isSetterExists = fs.existsSync(setterPath)
        let attributeRelativePath = join('..', config.attributePath, attribute)
        if (isComponentExists) {
          content += uf("import {default as %sComponent} from '%s'\n", attribute, join(attributeRelativePath, 'Component').replace(/\\/g, '/'))
        }
        if (isGetterExists) {
          content += uf("import {default as %sGetter} from '%s'\n", attribute, join(attributeRelativePath, 'Getter').replace(/\\/g, '/'))
        }
        if (isSetterExists) {
          content += uf("import {default as %sSetter} from '%s'\n", attribute, join(attributeRelativePath, 'Setter').replace(/\\/g, '/'))
        }
        if (isComponentExists) {
          content += uf("attributeService.add('%s', %sComponent, {", attribute, attribute)
        } else {
          content += uf("attributeService.add('%s', null, {", attribute)
        }
        let gettersSetters = []
        if (isGetterExists) {
          gettersSetters.push(uf('getter: %sGetter', attribute))
        }
        if (isSetterExists) {
          gettersSetters.push(uf('setter: %sSetter', attribute))
        }
        content += gettersSetters.join(',')
        content += uf(`})\n`)
      }
    })
    return content
  },
  writeToFile (prefix, content) {
    fs.writeFileSync(join(config.publicDir, config.configPath, uf('%s-attributes.js', prefix)), content)
  }
}

let AttributesCollector = () => {}

AttributesCollector.prototype.apply = function (compiler) {
  compiler.plugin('run', function (params, callback) {
    console.log('Collect attributes')
    const content = Collector.getAttributes()
    Object.keys(options.vc).forEach((prefix) => {
      Collector.writeToFile(prefix, content)
    })
    callback()
  })
}
module.exports = AttributesCollector
