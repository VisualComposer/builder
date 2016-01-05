var React = require('react');
var ParamMixin = require('../param-mixin');
var Setter = require('./Setter');

module.exports = React.createClass({
    mixins: [ParamMixin],
    handleChange: function() {
        this.updateElement(Setter);
        this.setState({value: this.refs.fcomponent.value});
    },
    render: function() {
        return <textarea
            ref="fcomponent"
            value={this.state.value} onChange={this.handleChange}/>;
    }
});
