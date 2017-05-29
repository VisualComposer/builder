const TemplateBuilder = require('./templateBuilder')
const BundleBuilder = require('./bundleBuilder')
const fs = require('fs-extra')
const path = require('path')
/**
 * Build template from json file
 * @param filePath
 */
exports.buildTemplateFromFile = (filePath, title, description, id, dir) => {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    const obj = JSON.parse(data)
    if (obj) {
      const builder = new TemplateBuilder(obj, title, description, id)
      const bundleDir = path.resolve(path.join(dir || path.dirname(filePath), builder.id))
      const bundle = new BundleBuilder(bundleDir)
      bundle
        .structurize()
        .createJSON(builder.build().getBuildTemplate())
    }
  })
}
