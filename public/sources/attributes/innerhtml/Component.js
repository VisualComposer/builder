var React = require('react');
var ParamMixin = require('../param-mixin.js');
module.exports = React.createClass({
    mixins: [ParamMixin],
    render: function() {
        return <textarea
            onChange={this.handleChange}
            ref="fcomponent"
            value={this.state.value} key={['vc-attribute-', 'innerhtml']}/>;
    }
});
