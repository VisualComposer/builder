var React = require('react');
require('./Section.less');
var Section = React.createClass({
	render: function() {
		var { key, content, ...other } = this.props;
		return (<section className="vc-v-section" key={key} {...other}>
			{content}
		</section>);
	}
});
module.exports = Section;