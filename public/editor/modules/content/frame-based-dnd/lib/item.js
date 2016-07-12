let $ = require('jquery')
/**
 * Item for DOM element
 * @param id
 * @param documentDOM
 * @constructor
 */
const Item = function (id, documentDOM) {
  this.id = id
  this.el = documentDOM.querySelector('[data-vc-element="' + this.id + '"]')
  this.$el = $(this.el)
}
Item.prototype.init = function () {
  return this
}
Item.prototype.on = function (event, callback, capture) {
  this.el.addEventListener(event, callback, !!capture)
  return this
}
Item.prototype.off = function (event, callback, capture) {
  this.el.removeEventListener(event, callback, !!capture)
  return this
}
module.exports = Item
