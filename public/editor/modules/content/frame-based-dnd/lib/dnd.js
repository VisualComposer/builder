var vcCake = require('vc-cake');
var Item = require('./item');
var $ = require('jquery');
/**
 * Drag&drop builder
 * @param container
 * @param options
 * @constructor
 */
var Builder = function(container, options) {
  this.container = container;
  this.items = {};
  this.hover = '';
  this.dragingElement = null;
  this.currentElement = null;
  this.frame = null;
  this.position = null;
  this.options = _.defaults(options, {
    radius: 20,
    cancelMove: false,
    moveCallback: function() {
    },
    startCallback: function() {
    },
    endCallback: function() {
    }
  });
};
Builder.prototype.init = function() {
  this.initContainer();
  this.buildHelper();
};
Builder.prototype.initContainer = function() {
  this.container.addEventListener('drag', this.handleDrag.bind(this), false);
};
Builder.prototype.addItem = function(id) {
  this.items[id] = new Item(id, this.options)
    .on('dragstart', this.handleDragStart.bind(this))
    .on('dragend', this.handleDragEnd.bind(this));
};
Builder.prototype.removeItem = function(id) {
  this.items[id]
    .off('dragstart', this.handleDragStart.bind(this))
    .off('dragend', this.handleDragEnd.bind(this));
  delete this.items[id];
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
Builder.prototype.createFrame = function() {
  this.frame = document.createElement('svg');
  this.frame.id = 'vcv-dnd-frame';
  document.body.appendChild(this.frame);
};
Builder.prototype.removeFrame = function() {
  this.frame = null;
  var frame = document.getElementById('vcv-dnd-frame');
  frame && document.body.removeChild(frame);
};
/**
 * Menage items
 */
Builder.prototype.renderControls = function() {
  _.defer(function() {
    Object.keys(this.items).forEach(function(key) {

    }, this);
  }.bind(this));
};
Builder.prototype.hideControls = function() {

};
Builder.prototype.checkItems = function(point) {
  var element = document.elementFromPoint(point.x, point.y);
  this.frame.className = '';
  if (element && element.getAttribute('data-vc-element')) {
    var rect = element.getBoundingClientRect();
    var offset = $(element).offset();
    this.frame.setAttribute('style', _.reduce({
      width: rect.width,
      height: rect.height,
      top: offset.top,
      left: offset.left
    }, function(result, value, key) {
      return result + key + ':' + value + 'px;'
    }, ''));
    this.currentElement = element.getAttribute('data-vc-element');

    var positionY = point.y - (offset.top + rect.height / 2);
    var positionX = point.x - (offset.left + rect.width / 2);
    if(
      'container' === element.getAttribute('data-vc-element-type') &&
      $(element).find('[data-vc-element]').length == 0 &&
      Math.abs(positionX) / rect.width < 0.2 && Math.abs(positionY) / rect.height < 0.2
    ) {
      this.position = 'append';
      this.frame.classList.add('vcv-dnd-frame-center');
    } else if (Math.abs(positionX) / rect.width > Math.abs(positionY) / rect.height) {
      this.position = positionX > 0 ? 'after' : 'before';
      this.frame.classList.add('vcv-dnd-frame-' + ('after' === this.position ? 'right' : 'left'));
    } else {
      this.position = positionY > 0 ? 'after' : 'before';
      this.frame.classList.add('vcv-dnd-frame-' + ('after' === this.position ? 'bottom' : 'top'));
    }
  }
};
/**
 * Drag handlers
 */
Builder.prototype.handleDrag = function(e) {
  this.frame && this.checkItems({x: e.clientX, y: e.clientY});
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
    e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be droppable
    e.dataTransfer.setData('Text', this.dragingElement.getAttribute('data-vc-element')); // required otherwise doesn't work
    this.hideHelper();
  }
  this.watchMouse();
  this.createFrame();
  this.renderControls();
  if ('function' === typeof this.options.startCallback) {
    this.options.startCallback(this.dragingElement);
  }
};
Builder.prototype.handleDragEnd = function(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  this.forgetMouse();
  this.hideControls();
  this.removeFrame();
  console.log('drag end');
  if ('function' === typeof this.options.endCallback) {
    this.options.endCallback(this.dragingElement);
  }
  if ('function' === typeof this.options.moveCallback) {
    this.options.moveCallback(
      this.dragingElement.getAttribute('data-vc-element'),
      this.position,
      this.currentElement
    );
  }
  this.dragingElement = null;
  this.currentElement = null;
  this.position = null;
};
/**
 * Global Constructor
 * @type {Builder}
 */
module.exports = Builder;
