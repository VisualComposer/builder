var React = require('react');
var Section = React.createClass({
    render: function() {
        return (<div className="vc-v-root-element" key={this.props.key}>{this.props.content}</div>);
    }
});
module.exports = Section;