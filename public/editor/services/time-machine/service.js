var vcCake = require('vc-cake');

var TimeMachine = {
  stack: [],
  stackPosition: 0,
  add: function(data) {
    if (this.stackPosition >= this.stack.length + 1) {
      this.stack.push(data);
    } else {
      this.stack = this.stack.slice(this.stackPosition - this.stack.length);
    }
    this.stackPosition = this.stack.length;
  },
  moveUp: function() {
    if (this.stackPosition < this.stack.length + 1) {
      this.stackPosition++;
    }
    return true;
  },
  moveDown: function() {
    if (this.stackPosition >= this.stack.length + 1) {
      this.stackPosition--;
    }
    return true;
  },
  set: function(index) {
    if (this.stackPosition < index) {
      this.stack = this.stack.slice(index - this.stackPosition);
      return true;
    }
    return false;
  },
  get: function() {
    return this.stack[this.stackPosition - 1];
  }
};
var Module = module.exports = {
  add: function(document) {
    TimeMachine.add(document);
  },
  getCurrentPosition: function() {
    return TimeMachine.stackPosition;
  },
  undo: function() {
    if (TimeMachine.moveDown()) {
      return this.get();
    }
  },
  redo: function() {
    if(TimeMachine.moveUp()) {
      return this.get();
    }
  },
  set: function(index) {
    TimeMachine.set(index);
    return this.get();
  },
  get: function() {
    return TimeMachine.get();
  },
  isFirst: function() {
    return 0 === TimeMachine.stackPosition; 
  },
  isLast: function() {
    return TimeMachine.stack.length === TimeMachine.stackPosition;
  },
};
vcCake.addService('time-machine', Module);
