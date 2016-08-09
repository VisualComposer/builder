let join = require('path').join
let fs = require('fs')
let uf = require('util').format
let config = require('./settings')
let exec = require('child_process').exec

const Collector = {
  buildFile () {
    let content = Collector.getElements()
    Collector.writeToFile(content)
  },
  getElements () {
    let path = join(config.publicDir, config.elementsPath)
    let files = fs.readdirSync(path)
    let content = ''
    files.forEach((element) => {
      let filePath = join(path, element)
      let stats = fs.lstatSync(filePath)
      let isDirectory = stats.isDirectory()
      if (isDirectory && element[ 0 ] !== '_') {
        let cssPath = join(filePath, 'styles.css')
        let isCssExists = fs.existsSync(cssPath) ? 'true' : 'false'

        exec(`node tools/element-builder/index.js public/sources/elements/${element} --output=file --uuid=${element} --add-css=${isCssExists}`)

        let elementRelativePath = join('..', config.elementsPath, element)
        content += uf("import {default as %sElement} from '%s'\n", element, join(elementRelativePath, 'element').replace(/\\/g, '/'))

      }
    })

    return content
  },
  writeToFile(content) {
    fs.writeFileSync(join(config.publicDir, config.configPath, uf('elements.js')), content)
  }
}

module.exports = Collector
