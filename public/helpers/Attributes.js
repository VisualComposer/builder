var Mediator = require('./Mediator');
var Manager = {
    element: false
};
var Attributes = module.exports = Mediator.installTo({
    setElement: function(element) {
        Manager.element = element;
    },
    update: function(key, value) {
    }
});



