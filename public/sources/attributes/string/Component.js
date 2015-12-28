var Elements = require( '../../../../helpers/Elements' );
var React = require('react');
var FormParamMixin = {
    getInitialState: function() {
      return
    },
    componentDidMount: function() {
        this.setState({content: this.props.content});
    },
    handleChange: function() {
        this.setState({value: this.refs.fcomponent.value});
    }
};
module.exports = React.createClass({
    mixins: [FormParam],
    render: function() {
        return <input
            onChange={this.handleChange}
            ref="fstring"
            value={this.state.value} />;
    }
});
