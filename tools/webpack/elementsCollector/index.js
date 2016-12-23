import {join} from 'path'
import fs from 'fs'
import config from '../settings'

const ElementsCollector = {
  getElements () {
    let path = join(config.publicDir, config.elementsPath)
    let files = fs.readdirSync(path)
    let elements = []
    files.forEach((element) => {
      let filePath = join(path, element)
      let stats = fs.lstatSync(filePath)
      let isDirectory = stats.isDirectory()
      if (isDirectory) {
        elements.push({ element: element, path: filePath })
      }
    })

    return elements
  }
}

module.exports = ElementsCollector
