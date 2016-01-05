var Mediator = require('../../helpers/Mediator');
var DataService = Mediator.getService('data');
var Mixin = {
    getInitialState: function() {
        return {
            value: this.props.value
        }
    },
    handleChange: function(e) {
        var value = this.refs[this.props.name + 'Component'].value;
        this.setState({value: value});
        this.updateElement(value);
    },
    updateElement: function(value) {
        this.setter(this.props.element, this.props.name, value);
        DataService.mutate(this.props.element);
    }
};

module.exports = Mixin;