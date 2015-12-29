var Mediator = require('../../helpers/Mediator');
var DataService = Mediator.getService('data');
var Mixin = {
    getInitialState: function() {
        return {
            value: this.props.value,
        }
    },
    updateElement: function(Setter) {
        Setter(this.props.element, this.props.name, this.refs.fcomponent.value);
        DataService.mutate(this.props.element);
    }
};

module.exports = Mixin;