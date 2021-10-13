var join = require('path').join
var elementsDirName = 'elements'
module.exports = {
  publicDir: join(__dirname, '../../../public'),
  servicePath: 'editor/services',
  modulePath: 'editor/modules',
  attributePath: 'sources/attributes',
  elementsDirName: elementsDirName,
  elementsPath: 'sources/' + elementsDirName,
  configPath: 'config'
}
