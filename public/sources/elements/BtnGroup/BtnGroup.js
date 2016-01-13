var React = require('react');
require('./BtnGroup.less');
var BtnGroup = React.createClass({
	render: function() {
		var { key, content, ...other } = this.props;
		return (<div className="vc-btn-group" key={key} {...other}>
			{content}
		</div>);
	}
});
module.exports = BtnGroup;