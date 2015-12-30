var Mediator = require('../../helpers/Mediator');
var TimeMachine = {
    stack: [],
    stackPosition: 0,
    add: function(data) {
        if(this.stackPosition >= this.stack.length+1) {
            this.stack.push(data);
        } else {
            this.stack = this.stack.slice(this.stackPosition-this.stack.length);
        }
        this.stackPosition = this.stack.length;
    },
    moveUp: function() {
        if(this.stackPosition < this.stack.length+1) {
            this.stackPosition++;
        }
        return true;
    },
    moveDown: function() {
        if(this.stackPosition >= this.stack.length+1) {
            this.stackPosition--;
        }
        return true;
    },
    set: function(index) {
        if(this.stackPosition < index) {
            this.stack = this.stack.slice(index-this.stackPosition);
            return true;
        }
        return false;
    },
    get: function() {
        return this.stack[this.stackPosition-1];
    }
};
var publishCurrentStep = function() {
    Mediator.getService('data').setDocument(TimeMachine.get());
    return true;
};
Mediator.installTo(TimeMachine);

TimeMachine.subscribe('data:changed', function(document){
    TimeMachine.add(document);
});
var Module = module.exports = {
    getCurrentIndex: function() {
        return TimeMachine.stackPosition;
    },
    undo: function() {
        TimeMachine.moveDown() && publishCurrentStep();
    },
    redo: function() {s
        TimeMachine.moveUp() && publishCurrentStep();
    },
    set: function(index) {
        TimeMachine.set(index) && publishCurrentStep();
    },
};
Mediator.addService('time-machine', Module);