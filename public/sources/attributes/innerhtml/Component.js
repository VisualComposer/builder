var React = require('react');
var ParamMixin = require('../param-mixin');
var Setter = require('./Setter');
module.exports = React.createClass({
    mixins: [ParamMixin],
    setter: Setter,
    render: function() {
        return <textarea
            ref={this.props.name + 'Component'}
            value={this.state.value} onChange={this.handleChange}/>;
    }
});
