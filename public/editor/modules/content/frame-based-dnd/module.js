var vcCake = require('vc-cake');
require('./css/module.less');
vcCake.add('frame-based-dnd', function(api) {
  var DnD = require('./lib/dnd');
  var ModuleDnd = function(api) {
    this.api = api;
    this.layoutAPI = this.api.module('content-layout');
    this.items = false;
  };
  ModuleDnd.prototype.buildItems = function() {
    if (!this.items) {
      this.items = new DnD(document.querySelector('[data-vcv-module="content-layout"]'), {
        radius: 350,
        cancelMove: true,
        moveCallback: this.move.bind(this),
        startCallback: this.start.bind(this),
        endCallback: this.end.bind(this)
      });
      this.items.init();
    }
  };
  ModuleDnd.prototype.init = function() {
    this.layoutAPI
      .on('element:mount', this.add.bind(this))
      .on('element:unmount', this.remove.bind(this));
  };
  ModuleDnd.prototype.add = function(id) {
    this.buildItems();
    this.items.addItem(id);
  };
  ModuleDnd.prototype.remove = function(id) {
    this.buildItems();
    this.items.removeItem(id);
  };
  ModuleDnd.prototype.move = function(id, action, related) {
    this.api.request('data:move', id, {action: action, related: related});
  };
  ModuleDnd.prototype.start = function() {
    this.api.module('content-editor-controls').do('enableControls', false);
  };
  ModuleDnd.prototype.end = function() {
    this.api.module('content-editor-controls').do('enableControls', true);
  };
  var dnd = new ModuleDnd(api);
  dnd.init();
});
