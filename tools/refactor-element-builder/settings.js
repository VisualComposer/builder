let join = require('path').join

module.exports = {
  publicDir: join(__dirname, '../../public'),
  servicePath: 'editor/services',
  modulePath: 'editor/modules',
  attributePath: 'sources/attributes',
  elementsDirName: '_elements',
  elementsPath: 'sources/_elements',
  newElementsPath: 'sources/newElements',
  configPath: 'config'
}
