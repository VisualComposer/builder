var React = require('react');
var Mediator = require( '../../helpers/Mediator' );
var getComponentPath = function(type) {
    return '../sources/attributes/' + type + '/Component.js';
};
// @todo add Nothing/Maybe monad :)

Mediator.addService('attributes', {
    getComponent: function(type, name, value) {
        var path = getComponentPath(this.type);
        return require(path);
    }
});