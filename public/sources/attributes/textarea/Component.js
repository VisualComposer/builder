var React = require('react');
var ParamMixin = require('../param-mixin.js');
module.exports = React.createClass({
    mixins: [ParamMixin],
    handleChange: function() {
        this.updateElement(Setter);
        this.setState({value: this.refs.fcomponent.value});
    },
    render: function() {
        return <textarea
            onChange={this.handleChange}
            ref="fcomponent"
            value={this.state.value}/>;
    }
});
