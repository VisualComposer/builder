var Control = function() {
  this.el = document.createElement('div');
  this.el.classList.add('vcv-atoll-control');
  this.el.setAttribute('droppable', 'true');
};
Control.prototype.setPosition = function(cord) {
  this.el.style.top = cord.y + 'px';
  this.el.style.left = cord.x + 'px';
  return this;
};
Control.prototype.setDropPosition = function(position) {
  this.el.setAttribute('data-vcv-drop-position', position);
  return this;
};

Control.prototype.add = function(node) {
  node.appendChild(this.el);
  return this;
};
Control.prototype.on = function(event, callback, capture) {
  this.el.addEventListener(event, callback, !!capture);
  return this;
};
Control.prototype.setSize = function(zoom) {
  this.el.classList.remove('vcv-visible-1', 'vcv-visible-2', 'vcv-visible-3', 'vcv-visible-4');
  if (zoom > 0) {
    this.el.classList.add('vcv-visible-' + zoom);
  }
  return this;
};
Control.prototype.getRect = function() {
  return this.el.getBoundingClientRect();
};
module.exports = Control;