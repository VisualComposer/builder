var React = require('react');
var ParamMixin = require('../param-mixin');
var Setter = require('./Setter');
module.exports = React.createClass({
    mixins: [ParamMixin],
    setter: Setter,
    render: function() {
        return (<div><label>{this.props.settings.getTitle()}</label><input
			type="text"
            onChange={this.handleChange}
            ref={this.props.name + 'Component'}
            value={this.state.value}/></div>);
    }
});
