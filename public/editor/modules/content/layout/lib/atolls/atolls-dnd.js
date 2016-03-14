var vcCake = require('vc-cake');
var documentData = vcCake.getService('document');
/**
 * Drag&drop builder
 * @param container
 * @param options
 * @constructor
 */
var Builder = function(container, options) {
  this.container = container;
  this.itemSelector = '';
  this.atolls = {};
  this.hover = '';
  this.dragingElement = null;
  this.options = _.defaults(options, {
    radius: 20
  });
};
Builder.prototype.init = function() {
  this.initContainer();
  this.buildHelper();
  this.buildHover();
};
Builder.prototype.initContainer = function() {
  this.container.addEventListener('drag', this.handleDrag.bind(this), false);
};
Builder.prototype.addItem = function(id) {
  var el = documentData.get(id);
  this.atolls[id] = new window.Atoll(el)
    .on('dragstart', this.handleDragStart.bind(this))
    .on('dragend', this.handleDragEnd.bind(this));
};
Builder.prototype.removeItem = function(id) {
  this.atolls[id]
    .off('dragstart', this.handleDragStart.bind(this))
    .off('dragend', this.handleDragEnd.bind(this));
  delete this.atolls[id];
};
Builder.prototype.watchMouse = function() {
  this.container.addEventListener('drag', _.debounce(this.handleDrag.bind(this), 150), false);
};
Builder.prototype.forgetMouse = function() {
  this.container.removeEventListener('drag', _.debounce(this.handleDrag.bind(this), 150), false);
};
/**
 * Helper
 */
Builder.prototype.buildHelper = function() {
  this.helper = document.createElement('div');
  this.helper.classList.add('vcv-drag-helper');
  document.body.appendChild(this.helper);
};
Builder.prototype.getHelper = function() {
  this.helper.classList.add('vcv-visible');
  return this.helper;
};
Builder.prototype.hideHelper = function() {
  _.defer(function() {
    this.helper.classList.remove('vcv-visible');
  }.bind(this));
};
/**
 * Hover
 */
Builder.prototype.buildHover = function() {
  this.hover = document.createElement('div');
  this.hover.classList.add('vcv-atolls-hover');
  document.body.appendChild(this.hover);
};
Builder.prototype.showHover = function() {
  _.defer(function() {
    this.hover && this.hover.classList.add('vcv-visible');
  }.bind(this));
};
Builder.prototype.hideHover = function() {
  _.defer(function() {
    this.hover && this.hover.classList.remove('vcv-visible');
  }.bind(this));
};
/**
 * Menage atolls
 */
Builder.prototype.renderControls = function() {
  _.defer(function() {
    this.atolls.forEach(function(atoll) {
      if (atoll.el !== this.dragingElement) {
        atoll.setControls();
      }
    });
  }.bind(this));
};
Builder.prototype.checkControls = function(center) {
  this.atolls.forEach(function(atoll) {
    if (atoll.el !== this.dragingElement) {
      atoll.checkControls(this.options.radius, center);
    }
  }, this);
};
Builder.prototype.hideControls = function() {
  $('.vcv-atoll-control').remove();
  this.atolls.forEach(function(atoll) {
    atoll.removeControls();
  });
};
/**
 * Drag handlers
 */
Builder.prototype.handleDrag = function(e) {
  this.checkControls({x: e.clientX, y: e.clientY});
};
/**
 *
 * @param {object} e
 */
Builder.prototype.handleDragStart = function(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  this.dragingElement = e.currentTarget;
  if (e.dataTransfer) {
    e.dataTransfer.setDragImage(this.getHelper(), 20, 20);
    e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
    e.dataTransfer.setData('Text', e.currentTarget.getAttribute('data-vcv')); // required otherwise doesn't work
    this.hideHelper();
  }
  this.watchMouse();
  this.showHover();
  this.renderControls();
};
Builder.prototype.handleDragEnd = function() {
  this.dragingElement = null;
  this.forgetMouse();
  this.hideControls();
  this.hideHover();
};
/**
 * Global Constructor
 * @type {Builder}
 */
module.exports = Builder;
