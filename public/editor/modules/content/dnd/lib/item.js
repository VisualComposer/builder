import $ from 'jquery'
import _ from 'lodash'
/**
 * Item for DOM element
 * @param id
 * @param node
 * @param options
 * @constructor
 */
const Item = function (id, node, options) {
  this.id = id
  this.options = _.defaults(options, {
    containerFor: null,
    relatedTo: null
  })
  this.el = node
  this.$el = $(this.el)
  this.init()
}
Item.prototype.init = function () {
  this.el.setAttribute('data-vcv-dnd-element', this.id)
  // Container for
  if (this.options.containerFor && this.options.containerFor.length > 0) {
    let containerFor = Array.isArray(this.options.containerFor) ? this.options.containerFor.join(',') : this.options.containerFor.toString()
    this.el.setAttribute('data-vcv-dnd-container-for', containerFor)
  }
  // Related to
  if (this.options.relatedTo && this.options.relatedTo.length > 0) {
    let relatedTo = Array.isArray(this.options.relatedTo) ? this.options.relatedTo.join(',') : this.options.relatedTo.toString()
    this.el.setAttribute('data-vcv-dnd-related-to', relatedTo)
  }
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
