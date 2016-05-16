var $ = require('jquery')
/**
 * Item for DOM element
 *
 * @constructor
 * @param {string} id Id of item
 * @param {oject} document dom
 */
var Item = function (id, documentDOM) {
  this.id = id
  this.el = documentDOM.querySelector('[data-vc-element="' + this.id + '"]')
  this.$el = $(this.el)
  this.init()
}
Item.prototype.init = function () {
  this.el.setAttribute('draggable', 'true')
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
