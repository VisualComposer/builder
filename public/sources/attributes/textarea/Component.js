var Elements = require( '../../../../helpers/Elements' );
var React = require('react');
var FormParamMixin = {
    componentDidMount: function() {
        this.setState({content: this.props.content});
    },
    handleChange: function() {
        this.setState({value: this.refs.fcomponent.value});
    },
};
module.exports = React.createClass({
    mixins: [FormParam],
    render: function() {
        return <textarea
            onChange={this.handleChange}
            ref="fcomponent"
            defaultValue={this.state.value} />;
    }
});
