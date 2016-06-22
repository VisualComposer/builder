var $ = require('jquery')
require('jquery-ui')
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
  this.$el.draggable({
    helper: 'clone',
    iframeFix: true
  })
  return this
}
Item.prototype.on = function (event, callback) {
  this.$el.on(event, callback)
  return this
}
Item.prototype.off = function (event, callback) {
  this.$el.off(event, callback)
  return this
}
module.exports = Item
