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
var publishCurrentStep = function() {
  vcCake.getService('data').setDocument(TimeMachine.get());
  return true;
};

var Module = module.exports = {
  getCurrentIndex: function() {
    return TimeMachine.stackPosition;
  },
  undo: function() {
    if (TimeMachine.moveDown()) {
      publishCurrentStep();
    }
  },
  redo: function() {
    if(TimeMachine.moveUp()) {
      publishCurrentStep();
    }
  },
  set: function(index) {
    if(TimeMachine.set(index)) { 
      publishCurrentStep();
    }
  },
};
vcCake.addService('time-machine', Module);
