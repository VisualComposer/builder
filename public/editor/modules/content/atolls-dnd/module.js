var vcCake = require('vc-cake');

vcCake.add('content-atolls-dnd', function(api) {
  require('./css/module.less');
  var AtollsDnD = require('./lib/atolls-dnd');
  var ModuleDnd = function(api) {
    this.layoutAPI = api.module('content-layout');
    this.atolls = false;
    this.init();
  };
  ModuleDnd.prototype.buildAtolls = function() {
    if (!this.atolls) {
      this.atolls = new AtollsDnD(document.querySelector('[data-vcv-module="content-layout"]'), {
        radius: 350,
        cancelMove: true,
        moveCallback: this.move.bind(this)
      });
      this.atolls.init();
    }
  };
  ModuleDnd.prototype.init = function() {
    this.layoutAPI
      .on('element:mount', this.add.bind(this))
      .on('element:unmount', this.remove.bind(this));
  };
  ModuleDnd.prototype.add = function(id) {
    this.buildAtolls();
    this.atolls.addItem(id);
  };
  ModuleDnd.prototype.remove = function(id) {
    this.buildAtolls();
    this.atolls.removeItem(id);
  };
  ModuleDnd.prototype.move = function(id, action, related) {
    api.request('data:move', id, {action: action, related: related});
  };
  new ModuleDnd(api);
});
