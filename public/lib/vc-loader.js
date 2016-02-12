var join = require('path').join;
module.exports = {
  loadService: function(name) {
    require(join(__dirname, '../editor/services', name, 'service.js'));
  },
  loadModule: function(name) {
    require(join(__drianme, '../editor/modules', name, 'module.js'));
  },
  loadSource: function(type, name) {
    return require(join(__dirname, '../sources', type, name +'.js'));
  },
  loadSourceElements: function(name, file) {
    return require(join(__drianme, '../sources', type, name +'.js'));
  }
};