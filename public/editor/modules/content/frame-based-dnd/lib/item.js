var $ = require('jquery');
/**
 * Item for DOM element
 * @param el  DOM element;
 * @constructor
 */
var Item = function(id, options) {
  this.id = id;
  this.options = _.defaults(options, {
  });
  this.el = document.querySelector('[data-vc-element="' + this.id + '"]');
  this.$el = $(this.el);
  this.init();
};
Item.prototype.init = function() {
  this.el.setAttribute('draggable', 'true');
  return this;
};
Item.prototype.on = function(event, callback, capture) {
  this.el.addEventListener(event, callback, !!capture);
  return this;
};
Item.prototype.off = function(event, callback, capture) {
  this.el.removeEventListener(event, callback, !!capture);
  return this;
};
module.exports = Item;