var React = require('react');
var TextBlock = React.createClass({
	render: function() {
		return (<p className="vc_v-text-block" key={this.props.key}>
			Hello text!
		</p>);
	}
});
module.exports = TextBlock;